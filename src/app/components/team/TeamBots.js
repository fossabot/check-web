import React, { Component } from 'react';
import Relay from 'react-relay/classic';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { Card, CardText, CardActions } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import Settings from 'material-ui/svg-icons/action/settings';
import Switch from '@material-ui/core/Switch';
import { Emojione } from 'react-emoji-render';
import { Link, browserHistory } from 'react-router';
import styled from 'styled-components';
import Form from 'react-jsonschema-form-material-ui';
import TeamRoute from '../../relay/TeamRoute';
import { units, ContentColumn, black32 } from '../../styles/js/shared';
import DeleteTeamBotInstallationMutation from '../../relay/mutations/DeleteTeamBotInstallationMutation';
import UpdateTeamBotInstallationMutation from '../../relay/mutations/UpdateTeamBotInstallationMutation';

const messages = defineMessages({
  confirmUninstall: {
    id: 'teamBots.confirmUninstall',
    defaultMessage: 'Are you sure you want to uninstall this bot?',
  },
});

const StyledCardText = styled(CardText)`
  display: flex;

  img {
    height: 100px;
    border: 1px solid ${black32};
    margin-${props => props.direction.to}: ${units(3)};
  }

  h2 {
    margin-bottom: ${units(1)};
  }
`;

const StyledToggle = styled.div`
  display: inline;

  span.toggleLabel {
    font-weight: bold;
    text-transform: uppercase;
    color: ${black32};
    align-self: center;
    vertical-align: middle;
  }

  .settingsIcon {
    vertical-align: middle;
    cursor: pointer;
    color: ${black32};
    margin: 0 ${units(1)};
  }
`;

const StyledSchemaForm = styled.div`
  div {
    padding: 0 !important;
    box-shadow: none !important;
  }

  fieldset {
    border: 0;
    padding: 0;
  }

  button {
    display: none;
  }
`;

class TeamBotsComponent extends Component {
  static handleBotGardenClick() {
    browserHistory.push('/check/bot-garden');
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: {},
      settings: {},
      message: null,
      messageBotId: null,
    };
  }

  componentWillMount() {
    const settings = {};
    this.props.team.team_bot_installations.edges.forEach((installation) => {
      const value = installation.node.json_settings || '{}';
      settings[installation.node.id] = JSON.parse(value);
    });
    this.setState({ settings });
  }

  handleSettingsUpdated(installation, data) {
    const settings = Object.assign({}, this.state.settings);
    settings[installation.id] = data.formData;
    this.setState({ settings, message: null, messageBotId: null });
  }

  handleSubmitSettings(installation) {
    const settings = JSON.stringify(this.state.settings[installation.id]);
    const messageBotId = installation.team_bot.dbid;
    const onSuccess = () => {
      this.setState({
        messageBotId,
        message: <FormattedMessage id="teamBots.success" defaultMessage="Settings updated!" />,
      });
    };
    const onFailure = () => {
      this.setState({
        messageBotId,
        message: <FormattedMessage id="teamBots.fail" defaultMessage="Error! Please try again." />,
      });
    };

    Relay.Store.commitUpdate(
      new UpdateTeamBotInstallationMutation({
        id: installation.id,
        json_settings: settings,
      }),
      { onSuccess, onFailure },
    );
  }

  handleToggleSettings(botId) {
    const expanded = Object.assign({}, this.state.expanded);
    expanded[botId] = !this.state.expanded[botId];
    this.setState({ expanded, message: null, messageBotId: null });
  }

  handleToggle(id, teamId) {
    // eslint-disable-next-line no-alert
    if (window.confirm(this.props.intl.formatMessage(messages.confirmUninstall))) {
      const onSuccess = () => {};
      const onFailure = () => {};

      Relay.Store.commitUpdate(
        new DeleteTeamBotInstallationMutation({
          id,
          teamId,
        }),
        { onSuccess, onFailure },
      );
    }
  }

  render() {
    const { team, direction } = this.props;

    return (
      <ContentColumn>
        { team.team_bot_installations.edges.length === 0 ?
          <p style={{ paddingBottom: units(5), textAlign: 'center' }}>
            <FormattedMessage
              id="teamBots.noBots"
              defaultMessage="No bots installed."
            />
          </p>
          : null }
        { team.team_bot_installations.edges.map((installation) => {
          const bot = installation.node.team_bot;

          return (
            <Card
              style={{ marginBottom: units(5) }}
              key={`bot-${bot.dbid}`}
              expanded={this.state.expanded[bot.dbid]}
            >
              <StyledCardText direction={direction}>
                <img src={bot.avatar} alt={bot.name} />
                <div>
                  <h2>{bot.name}</h2>
                  <p>{bot.description}</p>
                  <p>
                    <Link to={`/check/bot/${bot.dbid}`}>
                      <FormattedMessage id="teamBots.moreInfo" defaultMessage="More info" />
                    </Link>
                  </p>
                </div>
              </StyledCardText>
              <CardActions style={{ padding: 0, textAlign: 'right' }}>
                <StyledToggle style={{ marginRight: 0 }}>
                  <span className="toggleLabel">
                    <FormattedMessage id="teamBots.inUse" defaultMessage="In Use" />
                  </span>
                  <Switch
                    checked
                    onClick={this.handleToggle.bind(this, installation.node.id, team.id)}
                  />
                  <Settings
                    onClick={this.handleToggleSettings.bind(this, bot.dbid)}
                    className="settingsIcon"
                  />
                </StyledToggle>
              </CardActions>
              <Divider />
              <CardText expandable>
                <h3><FormattedMessage id="teamBots.settings" defaultMessage="Settings" /></h3>
                { bot.settings_as_json_schema ?
                  <StyledSchemaForm>
                    <Form
                      schema={JSON.parse(bot.settings_as_json_schema)}
                      formData={this.state.settings[installation.node.id]}
                      onChange={this.handleSettingsUpdated.bind(this, installation.node)}
                    />
                    <p>
                      <FlatButton
                        primary
                        onClick={this.handleSubmitSettings.bind(this, installation.node)}
                        label={
                          <FormattedMessage
                            id="teamBots.save"
                            defaultMessage="Save"
                          />
                        }
                      />
                    </p>
                    <p>
                      <small>
                        { this.state.message && this.state.messageBotId === bot.dbid ?
                          this.state.message : null
                        }
                      </small>
                    </p>
                  </StyledSchemaForm> :
                  <FormattedMessage
                    id="teamBots.noSettings"
                    defaultMessage="There are no settings for this bot."
                  />
                }
              </CardText>
            </Card>
          );
        })}
        <p style={{ textAlign: direction.to }}>
          <FlatButton
            onClick={TeamBotsComponent.handleBotGardenClick}
            label={
              <span>
                <FormattedMessage
                  id="teamBots.botGarden"
                  defaultMessage="Browse the Bot Garden"
                /> <Emojione text="🤖 🌼" />
              </span>
            }
          />
        </p>
      </ContentColumn>
    );
  }
}

TeamBotsComponent.propTypes = {
  // https://github.com/yannickcr/eslint-plugin-react/issues/1389
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

const TeamBotsContainer = Relay.createContainer(injectIntl(TeamBotsComponent), {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        dbid
        slug
        team_bot_installations(first: 10000) {
          edges {
            node {
              id
              json_settings
              team_bot {
                id
                dbid
                avatar
                name
                settings_as_json_schema
                description
              }
            }
          }
        }
      }
    `,
  },
});

const TeamBots = (props) => {
  const route = new TeamRoute({ teamSlug: props.team.slug });
  const params = { propTeam: props.team, direction: props.direction };
  return (
    <Relay.RootContainer
      Component={TeamBotsContainer}
      route={route}
      renderFetched={data => <TeamBotsContainer {...data} {...params} />}
    />
  );
};

export default TeamBots;
