import React from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import MeRoute from '../MeRoute';
import UserMenu from '../../components/user/UserMenu';
import userFragment from '../userFragment';
import { Pulse, white, avatarSize } from '../../styles/js/shared';

const StyledAvatarLoader = styled(Pulse)`
  background-color: ${white};
  width: ${avatarSize}px;
  height: ${avatarSize}px;
  border-radius: 50%;
  flex: 0 0 auto;
`;

const UserMenuRelay = (props) => {
  const UserMenuContainer = Relay.createContainer(UserMenu, {
    fragments: {
      user: () => userFragment,
    },
  });

  const route = new MeRoute();
  return (
    <Relay.RootContainer
      Component={UserMenuContainer}
      route={route}
      renderLoading={() => <StyledAvatarLoader />}
      renderFetched={data => <UserMenuContainer {...props} {...data} />}
    />
  );
};

export default UserMenuRelay;
