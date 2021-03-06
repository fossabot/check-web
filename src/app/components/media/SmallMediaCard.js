import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import Card from '@material-ui/core/Card';
import LayersIcon from '@material-ui/icons/Layers';
import rtlDetect from 'rtl-detect';
import styled from 'styled-components';
import { CardWithBorder } from './MediaDetail';
import MediaSelectable from './MediaSelectable';
import ItemDeadline from './ItemDeadline';
import MediaUtil from './MediaUtil';
import LayerIcon from '../icons/Layer';
import { getStatus, getStatusStyle } from '../../helpers';
import { mediaStatuses, mediaLastStatus } from '../../customHelpers';
import { black38, units, Offset, Row } from '../../styles/js/shared';

const messages = defineMessages({
  relatedCount: {
    id: 'smallMediaCard.relatedCount',
    defaultMessage: '{relatedCount} related items',
  },
  child: {
    id: 'smallMediaCard.child',
    defaultMessage: 'Related to another item',
  },
});

const RelationIcon = styled.div`
  svg {
    min-width: 20px !important;
    min-height: 20px !important;
    color: ${black38};
  }
`;

const Content = styled.div`
  width: ${props => (props.withImage ? units(21) : units(32))};
  height: ${units(10)};
  display: flex;
  flex-direction: column;
  align-content: flex-end;
`;

const UpperRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const BottomRow = styled.div`
  width: 100%;
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  font-size: smaller;
`;

const SmallMediaCard = (props) => {
  const { media, intl: { locale } } = props;
  const status = getStatus(mediaStatuses(media), mediaLastStatus(media));

  let relatedCount = 0;

  if (media.relationships) {
    const { sources_count, targets_count } = media.relationships;
    relatedCount = sources_count + targets_count;
  }

  let isChild = false;
  let isParent = false;

  if (media.relationships && media.relationship) {
    if (media.relationship.target_id === media.dbid) {
      isChild = true;
    } else if (media.relationship.source_id === media.dbid) {
      isParent = true;
    }
  }

  const isRtl = rtlDetect.isRtlLang(locale);

  const mediaUrl = media.team && media.dbid > 0
    ? `/${media.team.slug}/project/${media.project_id}/media/${media.dbid}`
    : null;

  const image = media.media.thumbnail_path || media.media.picture;
  const data = typeof media.embed === 'string' ? JSON.parse(media.embed) : media.embed;

  media.url = media.media.url;
  media.quote = media.media.quote;

  return (
    <MediaSelectable media={media} onSelect={props.onSelect}>
      <CardWithBorder
        fromDirection={isRtl ? 'right' : 'left'}
        borderColor={getStatusStyle(status, 'backgroundColor')}
      >
        <Card
          className="card-with-border"
          style={{ height: units(12), width: units(35) }}
        >
          <div
            className={props.selected ? 'media-detail__card-header-selected' : 'media-detail__card-header'}
            style={{ padding: units(1), height: units(12), cursor: media.dbid === 0 ? 'wait' : 'default' }}
          >
            <Row>
              { image ?
                <Offset isRtl={isRtl}>
                  <Link to={mediaUrl}>
                    <img
                      alt=""
                      style={{ width: units(10), height: units(10), objectFit: 'cover' }}
                      src={image}
                    />
                  </Link>
                </Offset>
                : null
              }
              <Content withImage={image}>
                <UpperRow>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: units(5) }}>
                    <Link to={mediaUrl}>
                      {MediaUtil.title(media, data, props.intl)}
                    </Link>
                  </div>
                  { isParent ?
                    <span
                      title={
                        props.intl.formatMessage(messages.relatedCount, { relatedCount })
                      }
                    >
                      <RelationIcon>
                        <LayersIcon />
                      </RelationIcon>
                    </span> : null
                  }
                  { isChild ?
                    (
                      <span title={props.intl.formatMessage(messages.child)}>
                        <RelationIcon>
                          <LayerIcon />
                        </RelationIcon>
                      </span>
                    ) : null
                  }
                </UpperRow>
                <BottomRow>
                  <ItemDeadline media={media} isRtl={isRtl} />
                </BottomRow>
              </Content>
            </Row>
          </div>
        </Card>
      </CardWithBorder>
    </MediaSelectable>
  );
};


export default injectIntl(SmallMediaCard);
