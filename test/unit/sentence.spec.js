import React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from 'enzyme';
import { expect } from 'chai';

import Sentence from '../../src/app/components/Sentence';

describe('<Sentence />', () => {
  it('should render empty string if list is empty', function() {
    const wrapper = render(<Sentence list={[]} />);
    expect(wrapper.html()).to.equal(null);
  });

  it('should render element if list has only one element', function() {
    const wrapper = render(<Sentence list={['Test']} />);
    expect(wrapper.text()).to.equal('Test');
  });

  it('should render two elements', function() {
    const wrapper = render(<IntlProvider locale="en"><Sentence list={['Foo', 'Bar']} /></IntlProvider>);
    expect(wrapper.text()).to.equal('Foo and Bar');
  });

  it('should render three elements', function() {
    const wrapper = render(<IntlProvider locale="en"><Sentence list={['A', 'B', 'C']} /></IntlProvider>);
    expect(wrapper.text()).to.equal('A, B and C');
  });

  it('should render four elements', function() {
    const wrapper = render(<IntlProvider locale="en"><Sentence list={['A', 'B', 'C', 'D']} /></IntlProvider>);
    expect(wrapper.text()).to.equal('A, B, C and D');
  });
});
