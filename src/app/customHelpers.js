import config from 'config'; // eslint-disable-line require-path-exists/exists

const customHelpers = {
  bridge: {
    teamStatuses(team) {
      return team.translation_statuses;
    },
    mediaStatuses(media) {
      return media.translation_statuses;
    },
    mediaLastStatus(media) {
      return media.field_value || 'pending';
    },
  },
  check: {
    teamStatuses(team) {
      return team.verification_statuses;
    },
    mediaStatuses(media) {
      return media.verification_statuses;
    },
    mediaLastStatus(media) {
      return media.last_status;
    },
  },
};

const customStrings = {
  bridge: {
    ABOUT_URL: 'https://meedan.com/bridge',
    ADMIN_EMAIL: 'bridge@meedan.com',
    CONTACT_HUMAN_URL: 'mailto:bridge@meedan.com',
    PP_URL: 'https://meedan.com/en/bridge/bridge_privacy.html',
    SUPPORT_EMAIL: 'bridge@meedan.com',
    TOS_URL: 'https://meedan.com/en/bridge/bridge_tos.html',
    LOGO_URL: '/images/logo/bridge.svg',
  },
  check: {
    ABOUT_URL: 'https://meedan.com/check',
    ADMIN_EMAIL: 'check@meedan.com',
    CONTACT_HUMAN_URL: 'https://meedan.typeform.com/to/Tvf0b8',
    PP_URL: 'https://meedan.com/en/check/check_privacy.html',
    SUPPORT_EMAIL: 'check@meedan.com',
    TOS_URL: 'https://meedan.com/en/check/check_tos.html',
    LOGO_URL: '/images/logo/check.svg',
    UPGRADE_URL: 'https://meedan.typeform.com/to/F9L2cY',
  },
};

function resolveHelper(name, args) {
  return customHelpers[config.appName][name].apply(this, args);
}

function teamStatuses(...args) {
  return resolveHelper('teamStatuses', args);
}

function mediaStatuses(...args) {
  return resolveHelper('mediaStatuses', args);
}

function mediaLastStatus(...args) {
  return resolveHelper('mediaLastStatus', args);
}

function stringHelper(key) {
  return customStrings[config.appName][key];
}

export {
  teamStatuses,
  mediaStatuses,
  mediaLastStatus,
  stringHelper,
};
