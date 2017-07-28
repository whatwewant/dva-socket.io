/**
* @Author: eason
* @Date:   2017-07-19T17:50:07+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   zero
 * @Last modified time: 2017-07-28T11:31:38+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import chai from 'chai';
import spies from 'chai-spies';
import { createListeners } from '../src/index';

chai.use(spies)
const expect = chai.expect;

describe('create listeners', () => {
  // fake history
  let rules;
  let dispatch;
  let action;
  beforeEach(() => {
    dispatch = e => e;
    action = 'action';
    rules = {
      listeners: {
        message: (data, dispatch) => dispatch(data)
      },
      listenersArray: [
        ['message', (data, dispatch) => dispatch(data)],
      ],
      emitters: {
        message: {
          evaulate: (action, dispatch) => true,
          data: action => action
        }
      }
    };
  });

  it('listeners length equal to rules.listeners key length.', () => {
    expect(createListeners(dispatch, rules.listeners).length).to.equal(Object.keys(rules.listeners).length);
  });

  it('listeners events equal.', () => {
    const listeners = createListeners(dispatch, rules.listeners);

    listeners.forEach(([event, listener]) => expect(event).to.equal('message'));
  });

  it('listeners result of function is in expected.', () => {
    const listeners = createListeners({ dispatch }, rules.listeners);

    listeners.forEach(([event, listener]) => expect(listener(action)).to.equal(dispatch(action)));
  });

  it('listeners should be an object or an array when string throw', () => {
    expect(() => createListeners(dispatch, 'string'))
      .to.throw(/createListeners: listeners should be an object or an array!/);
  });

  it('listeners should be an object or an array when undefined not throw', () => {
    expect(() => createListeners(dispatch, undefined))
      .to.not.throw();
  });

  // array
  it('listeners(array) events equal.', () => {
    const listeners = createListeners(dispatch, rules.listenersArray);

    listeners.forEach(([event, listener]) => expect(event).to.equal('message'));
  });

  it('listeners(array) result of function is in expected.', () => {
    const listeners = createListeners({ dispatch }, rules.listenersArray);

    listeners.forEach(([event, listener]) => expect(listener(action)).to.equal(dispatch(action)));
  });

  it('listeners(array) default listener', () => {
    const listeners = createListeners({ dispatch }, ['message']);

    listeners.forEach(([event, listener]) => expect(listener(action)).to.equal(dispatch(action)));
  });
});
