import React from 'react';
import { Link } from 'react-router';
import IconArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import { HeaderTitle, FadeIn, SlideIn, black54 } from '../../styles/js/shared';

const BackArrow = (props) => {
  if (props.url) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <IconButton
          containerElement={<Link to={props.url} />}
          className="header__back-button"
        >
          <FadeIn>
            <SlideIn>
              <IconArrowBack color={black54} />
            </SlideIn>
          </FadeIn>
        </IconButton>
        <HeaderTitle>{props.label}</HeaderTitle>
      </div>
    );
  }
  return null;
};

export default BackArrow;
