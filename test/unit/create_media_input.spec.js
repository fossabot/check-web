import React from 'react';
import { expect } from 'chai';
import { render } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { mountWithIntl } from './helpers/intl-test';
import CreateMediaInput from '../../src/app/components/media/CreateMediaInput';
import UploadImage from '../../src/app/components/UploadImage';

describe('<CreateMediaInput />', () => {
  it('should render all input tabs buttons', function() {
    const wrapper = mountWithIntl(<CreateMediaInput />);
    expect(wrapper.find('#create-media__link').hostNodes()).to.have.length(1);
    expect(wrapper.find('#create-media__quote').hostNodes()).to.have.length(1);
    expect(wrapper.find('#create-media__source').hostNodes()).to.have.length(1);
    expect(wrapper.find('#create-media__image').hostNodes()).to.have.length(1);
  });

  it('should not render source input tab button', function() {
    const wrapper = mountWithIntl(<CreateMediaInput noSource />);
    expect(wrapper.find('#create-media__link').hostNodes()).to.have.length(1);
    expect(wrapper.find('#create-media__quote').hostNodes()).to.have.length(1);
    expect(wrapper.find('#create-media__source').hostNodes()).to.have.length(0);
    expect(wrapper.find('#create-media__image').hostNodes()).to.have.length(1);
  });

  it('should render input fields', function() {
    const wrapper = mountWithIntl(<CreateMediaInput />);
    expect(wrapper.find('#create-media-input').hostNodes()).to.have.length(1);
    wrapper.find('#create-media__quote').hostNodes().simulate('click');
    expect(wrapper.find('#create-media-quote-input').hostNodes()).to.have.length(1);
    wrapper.find('#create-media__source').hostNodes().simulate('click');
    expect(wrapper.find('#create-media-source-name-input').hostNodes()).to.have.length(1);
    expect(wrapper.find('#create-media-source-url-input').hostNodes()).to.have.length(1);
    wrapper.find('#create-media__image').hostNodes().simulate('click');
    expect(wrapper.find(UploadImage)).to.have.length(1);
  });
});
