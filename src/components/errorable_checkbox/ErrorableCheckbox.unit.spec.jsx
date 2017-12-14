import React from 'react';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { shallow } from 'enzyme';
import { axeCheck } from '../../../lib/testing/helpers';
import ErrorableCheckbox from './ErrorableCheckbox.jsx';

chai.use(chaiAsPromised);
const { expect } = chai;
/* eslint-disable no-unused-vars */
describe('<ErrorableCheckbox/>', () => {
  it('should render', () => {
    let tree;
    const updatePromise = new Promise((resolve, _reject) => {
      tree = shallow(<ErrorableCheckbox label="test" onValueChange={(update) => { resolve(update); }}/>);
    });
    expect(tree.text()).to.contain('test');
  });

  it('should pass aXe check', () => {
    let check;
    const updatePromise = new Promise((resolve, _reject) => {
      check = axeCheck(<ErrorableCheckbox label="test" onValueChange={(update) => { resolve(update); }}/>);
    });
    return check;
  });
  it('ensure checked changes propagate', () => {
    let tree;

    const updatePromise = new Promise((resolve, _reject) => {
      tree = shallow(<ErrorableCheckbox label="test" onValueChange={(update) => { resolve(update); }}/>);
    });

    expect(tree.find('[type="checkbox"][checked="checked"]')).to.have.length(0);
    tree.find('[type="checkbox"]').simulate('change', { target: { checked: true } });
    return expect(updatePromise).to.eventually.eql(true);
  });

  it('no error styles when errorMessage undefined', () => {
    const tree = shallow(<ErrorableCheckbox label="my label" onValueChange={(_update) => {}}/>);

    // No error classes.
    expect(tree.children('.usa-input-error')).to.have.lengthOf(0);
    expect(tree.children('.usa-input-error-label')).to.have.lengthOf(0);
    expect(tree.children('.usa-input-error-message')).to.have.lengthOf(0);

    // Ensure no unnecessary class names on label w/o error..
    const labels = tree.children('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels.prop('className')).to.be(undefined, 'Unnecessary class names on label without error');

    // No error means no aria-describedby to not confuse screen readers.
    const inputs = tree.children('input');
    expect(inputs).to.have.lengthOf(1);
    expect(inputs.prop('aria-describedby')).to.be(undefined, 'Unnecessary aria-describedby');
  });

  it('has error styles when errorMessage is set', () => {
    const tree = shallow(<ErrorableCheckbox label="my label" errorMessage="error message" onValueChange={(_update) => {}}/>);

    // Ensure all error classes set.
    expect(tree.find('.usa-input-error')).to.have.lengthOf(1);

    const labels = tree.find('.usa-input-error-label');
    expect(labels).to.have.lengthOf(1);

    const errorMessages = tree.find('.usa-input-error-message');
    expect(errorMessages).to.have.lengthOf(1);
    expect(errorMessages.text()).to.equal('error message');

    // No error means no aria-describedby to not confuse screen readers.
    const inputs = tree.find('input');
    expect(inputs).to.have.lengthOf(1);
    expect(inputs.prop('aria-describedby')).to.not.be(undefined);
    expect(inputs.prop('aria-describedby')).to.equal(errorMessages.prop('id'));
  });

  it('required=false does not have required asterisk', () => {
    const tree = shallow(<ErrorableCheckbox label="my label" onValueChange={(_update) => {}}/>);

    expect(tree.find('label').text()).to.equal('my label');
  });

  it('required=true has required asterisk', () => {
    const tree = shallow(<ErrorableCheckbox label="my label" required onValueChange={(_update) => {}}/>);

    const label = tree.find('label');
    expect(label.text()).to.equal('my label*');
  });

  it('label attribute propagates', () => {
    const tree = shallow(<ErrorableCheckbox label="my label" onValueChange={(_update) => {}}/>);

    // Ensure label text is correct.
    const labels = tree.find('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels.text()).to.equal('my label');

    // Ensure label htmlFor is attached to input id.
    const inputs = tree.find('input');
    expect(inputs).to.have.lengthOf(1);
    expect(inputs.prop('id')).to.not.be(undefined);
    expect(inputs.prop('id')).to.equal(labels.prop('htmlFor'));
  });

/* eslint-enable no-unused-vars */
});
