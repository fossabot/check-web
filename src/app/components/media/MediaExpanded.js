import React, { Component } from 'react';
import Relay from 'react-relay/classic';
import PropTypes from 'prop-types';
import { CardText, CardActions } from 'material-ui/Card';
import MediaRoute from '../../relay/MediaRoute';
import MediaMetadata from './MediaMetadata';
import MediaUtil from './MediaUtil';
import ParsedText from '../ParsedText';
import QuoteMediaCard from './QuoteMediaCard';
import WebPageMediaCard from './WebPageMediaCard';
import ImageMediaCard from './ImageMediaCard';
import PenderCard from '../PenderCard';
import { bemClassFromMediaStatus } from '../../helpers';
import { mediaLastStatus } from '../../customHelpers';
import CheckContext from '../../CheckContext';
import {
  FadeIn,
  caption,
  black54,
  units,
  Text,
} from '../../styles/js/shared';

class MediaExpandedComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaVersion: false,
    };
  }

  getContext() {
    return new CheckContext(this).getContextStore();
  }

  render() {
    const media = Object.assign(this.props.currentMedia, this.props.media);
    const data = typeof media.embed === 'string' ? JSON.parse(media.embed) : media.embed;
    const isImage = !!media.media.embed_path;
    const isQuote = media.media.quote && media.media.quote.length;
    const isWebPage = media.media.url && data.provider === 'page';
    const authorName = MediaUtil.authorName(media, data);
    const authorUsername = MediaUtil.authorUsername(media, data);
    const isPender = media.media.url && data.provider !== 'page';
    const randomNumber = Math.floor(Math.random() * 1000000);
    const shouldShowDescription = MediaUtil.hasCustomDescription(media, data);
    const { inMediaPage, mediaUrl } = this.props;

    const embedCard = (() => {
      if (isImage) {
        return <ImageMediaCard imagePath={media.embed_path} />;
      } else if (isQuote) {
        return (
          <QuoteMediaCard
            quote={media.quote}
            languageCode={media.language_code}
            sourceUrl={this.props.sourceUrl}
            sourceName={this.props.sourceName}
          />
        );
      } else if (isWebPage) {
        return (
          <WebPageMediaCard
            media={media}
            mediaUrl={this.props.mediaUrl}
            data={data}
            isRtl={this.props.isRtl}
            authorName={authorName}
            authorUserName={authorUsername}
          />
        );
      } else if (isPender) {
        return (
          <PenderCard
            url={media.url}
            fallback={null}
            domId={`pender-card-${randomNumber}`}
            mediaVersion={this.state.mediaVersion || data.refreshes_count}
          />
        );
      }

      return null;
    })();

    return (
      <span>
        <CardText
          style={{ cursor: inMediaPage ? null : 'pointer' }}
          onClick={inMediaPage ? null : () => {
            this.getContext().history.push(mediaUrl);
          }}
        >
          <FadeIn className={bemClassFromMediaStatus('media-detail__media', mediaLastStatus(media))}>
            {shouldShowDescription ?
              <Text font={caption} style={{ color: black54 }}>
                <ParsedText text={data.description} />
              </Text> : null}
            {embedCard}
          </FadeIn>
        </CardText>
        <CardActions style={{ paddingRight: units(0.5) }}>
          <MediaMetadata data={data} {...this.props} media={media} />
        </CardActions>
      </span>
    );
  }
}

MediaExpandedComponent.contextTypes = {
  store: PropTypes.object,
};

const MediaExpandedContainer = Relay.createContainer(MediaExpandedComponent, {
  initialVariables: {
    contextId: null,
  },
  fragments: {
    media: () => Relay.QL`
      fragment on ProjectMedia {
        id
        dbid
        relationship {
          id
          permissions
          source { id, dbid }
          source_id
          target { id, dbid }
          target_id
        }
        last_status_obj {
          id
          dbid
          locked
          content
          assignments(first: 10000) {
            edges {
              node {
                id
                dbid
                name
                source {
                  id
                  dbid
                  image
                }
              }
            }
          }
        }
        user {
          dbid,
          name,
          is_active
          source {
            dbid,
            image,
            accounts(first: 10000) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    `,
  },
});

const MediaExpanded = (props) => {
  const ids = `${props.currentMedia.dbid},${props.currentMedia.project_id}`;
  const route = new MediaRoute({ ids });

  return (
    <Relay.RootContainer
      Component={MediaExpandedContainer}
      renderFetched={data => <MediaExpandedContainer {...props} {...data} />}
      route={route}
    />
  );
};

export default MediaExpanded;
