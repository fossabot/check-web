import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import isEqual from 'lodash.isequal';
import TeamRoute from '../../relay/TeamRoute';
import CheckContext from '../../CheckContext';
import Search from '../search/Search';

const messages = defineMessages({
  title: {
    id: 'trash.title',
    defaultMessage: 'Trash',
  },
});

class TrashComponent extends React.Component {
  componentDidMount() {
    this.setContextTeam();
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  componentDidUpdate() {
    this.setContextTeam();
  }

  getContext() {
    return new CheckContext(this);
  }

  setContextTeam() {
    const context = this.getContext();
    const currentContext = this.currentContext();

    if (!currentContext.team || currentContext.team.slug !== this.props.team.slug) {
      context.setContextStore({ team: this.props.team });
    }
  }

  currentContext() {
    return this.getContext().getContextStore();
  }

  render() {
    const { team } = this.props;

    const query = JSON.parse(this.props.params.query || '{}');
    query.archived = 1;

    return (
      <div className="trash">
        <Search
          title={this.props.intl.formatMessage(messages.title)}
          team={team.slug}
          query={JSON.stringify(query)}
          fields={['status', 'sort', 'tags']}
          view="list"
          page="trash"
        />
      </div>
    );
  }
}

TrashComponent.contextTypes = {
  store: PropTypes.object,
};

TrashComponent.propTypes = {
  // https://github.com/yannickcr/eslint-plugin-react/issues/1389
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

const TrashContainer = Relay.createContainer(TrashComponent, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        dbid
        slug
        permissions
        search_id
      }
    `,
  },
});

const Trash = (props) => {
  const slug = props.params.team || '';
  const route = new TeamRoute({ teamSlug: slug });
  return (
    <Relay.RootContainer
      Component={TrashContainer}
      forceFetch
      route={route}
      renderFetched={data => <TrashContainer {...props} {...data} />}
    />
  );
};

export default injectIntl(Trash);
