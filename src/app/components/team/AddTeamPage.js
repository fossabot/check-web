import React from 'react';
import Relay from 'react-relay/classic';
import {
  defineMessages,
  injectIntl,
  intlShape,
} from 'react-intl';
import CreateTeamCard from './CreateTeamCard';
import FindTeamCard from './FindTeamCard';
import PageTitle from '../PageTitle';
import {
  ContentColumn,
} from '../../styles/js/shared';
import PublicTeamRoute from '../../relay/PublicTeamRoute';
import RelayContainer from '../../relay/RelayContainer';

const messages = defineMessages({
  titleCreate: {
    id: 'addTeamPage.titleCreate',
    defaultMessage: 'Create a Team',
  },
  titleFind: {
    id: 'addTeamPage.titleFind',
    defaultMessage: 'Find an existing team',
  },
});

const AddTeamComponent = (props) => {
  const mode = props.route.path === 'check/teams/find(/:slug)' ? 'find' : 'create';

  const title = mode === 'find' ? messages.titleFind : messages.titleCreate;

  return (
    <PageTitle
      prefix={props.intl.formatMessage(title)}
      skipTeam
    >
      <main className="create-team">
        <ContentColumn narrow>
          { mode === 'find' ?
            <FindTeamCard {...props} /> : <CreateTeamCard />
          }
        </ContentColumn>
      </main>
    </PageTitle>
  );
};

AddTeamComponent.propTypes = {
  // https://github.com/yannickcr/eslint-plugin-react/issues/1389
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

const AddTeamContainer = Relay.createContainer(injectIntl(AddTeamComponent), {
  fragments: {
    team: () => Relay.QL`
      fragment on PublicTeam {
        id,
        dbid,
        slug,
      }
    `,
  },
});

const AddTeam = (props) => {
  const route = new PublicTeamRoute({ teamSlug: props.params.slug });

  return (
    <RelayContainer
      Component={AddTeamContainer}
      route={route}
      forceFetch
      renderFetched={data => <AddTeamContainer {...props} {...data} />}
    />
  );
};

export default AddTeam;
