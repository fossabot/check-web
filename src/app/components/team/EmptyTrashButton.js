import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { injectIntl, FormattedMessage } from 'react-intl';
import RaisedButton from 'material-ui/RaisedButton';
import isEqual from 'lodash.isequal';
import ConfirmDialog from '../layout/ConfirmDialog';
import TeamRoute from '../../relay/TeamRoute';
import UpdateTeamMutation from '../../relay/mutations/UpdateTeamMutation';
import Can from '../Can';

class EmptyTrashComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emptyTrashDisabled: false,
      open: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState) ||
    !isEqual(this.props, nextProps);
  }

  handleMessage(message) {
    this.context.setMessage(message);
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleConfirmEmptyTrash() {
    this.handleClose();
    this.handleEmptyTrash();
  }

  handleEmptyTrash() {
    if (!this.state.emptyTrashDisabled) {
      this.setState({ emptyTrashDisabled: true });

      const onFailure = (transaction) => {
        const transactionError = transaction.getError();
        if (transactionError.json) {
          transactionError.json().then(this.handleMessage);
        } else {
          this.handleMessage(JSON.stringify(transactionError));
        }
        this.setState({ emptyTrashDisabled: false });
      };

      const onSuccess = () => {
      };

      Relay.Store.commitUpdate(
        new UpdateTeamMutation({
          empty_trash: 1,
          search_id: this.props.search.id,
          id: this.props.team.id,
        }),
        { onSuccess, onFailure },
      );
    }
  }

  render() {
    const { team, search: { number_of_results } } = this.props;

    return (
      <div className="empty-trash-button">
        <ConfirmDialog
          message={this.state.message}
          open={this.state.open}
          title={<FormattedMessage id="trash.emptyTrash" defaultMessage="Empty trash" />}
          blurb={<FormattedMessage
            id="trash.emptyTrashConfirmationText"
            defaultMessage="Are you sure? This will permanently delete {itemsCount, plural, =0 {0 items} one {1 item} other {# items}} and {notesCount, plural, =0 {0 annotations} one {1 annotation} other {# annotations}}."
            values={{
              itemsCount: team.trash_size.project_media.toString(),
              notesCount: team.trash_size.annotation.toString(),
            }}
          />}
          handleClose={this.handleClose.bind(this)}
          handleConfirm={this.handleConfirmEmptyTrash.bind(this)}
        />

        <Can permissions={team.permissions} permission="empty Trash">
          <RaisedButton
            label={<FormattedMessage id="trash.emptyTrash" defaultMessage="Empty trash" />}
            className="trash__empty-trash-button"
            primary
            onClick={this.handleOpen}
            disabled={this.state.emptyTrashDisabled || number_of_results === 0}
          />
        </Can>
      </div>
    );
  }
}

EmptyTrashComponent.contextTypes = {
  store: PropTypes.object,
  setMessage: PropTypes.func,
};

const EmptyTrashContainer = Relay.createContainer(EmptyTrashComponent, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        dbid
        slug
        permissions
        trash_size
      }
    `,
  },
});

const EmptyTrashButton = (props) => {
  const slug = props.teamSlug || '';
  const route = new TeamRoute({ teamSlug: slug });
  return (
    <Relay.RootContainer
      Component={EmptyTrashContainer}
      route={route}
      renderFetched={data => <EmptyTrashContainer {...props} {...data} />}
      forceFetch
    />
  );
};

export default injectIntl(EmptyTrashButton);
