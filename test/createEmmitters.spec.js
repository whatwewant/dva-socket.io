/**
* @Author: eason
* @Date:   2017-07-19T17:50:07+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-07-20T15:08:09+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import chai from 'chai';
import spies from 'chai-spies';
import { createEmiters } from '../src/index';

chai.use(spies)
const expect = chai.expect;

describe('create emitters', () => {
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
      emitters: {
        message: {
          evaluate: (action, dispatch) => true,
          data: action => action
        }
      },
      emittersWithoutData: {
        message: {
          evaluate: (action, dispatch) => true,
        },
      },
      emittersArray: [
        ['message', (action, dispatch) => true, action => action],
      ],
      emittersArrayWithoutData: [
        ['message', (action, dispatch) => true],
      ],
    };
  });

  // object

  it('emitters length equal to rules.listeners key length.', () => {
    expect(createEmiters(dispatch, action, rules.emitters).length).to.equal(Object.keys(rules.emitters).length);
  });

  it('emitters events equal.', () => {
    const emitters = createEmiters(dispatch, action, rules.emitters);

    emitters.forEach(([event, evaluate]) => expect(event).to.equal('message'));
  });

  it('emitters evaluate true', () => {
    const emitters = createEmiters(dispatch, action, rules.emitters);

    emitters.forEach(([event, evaluate, data]) => expect(evaluate()).to.equal(true));
  });

  it('emitters data equal to action', () => {
    const emitters = createEmiters(dispatch, action, rules.emitters);

    emitters.forEach(([event, evaluate, data]) => expect(data()).to.equal(action));
  });

  it('emitters without data provided default data equal to action', () => {
    const emitters = createEmiters(dispatch, action, rules.emittersWithoutData);

    emitters.forEach(([event, evaluate, data]) => expect(data()).to.equal(action));
  });

  it('emitters without data provided default data equal to action', () => {
    const emitters = createEmiters(dispatch, action, {
      message: { evaluate: e => true, data: 'plain value' },
    });

    emitters.forEach(([event, evaluate, data]) => expect(data()).to.equal('plain value'));
  });

  // array

  it('emitters(array) events equal.', () => {
    const emitters = createEmiters(dispatch, action, rules.emittersArray);

    emitters.forEach(([event, evaluate]) => expect(event).to.equal('message'));
  });

  it('emitters(array) evaluate true', () => {
    const emitters = createEmiters(dispatch, action, rules.emittersArray);

    emitters.forEach(([event, evaluate, data]) => expect(evaluate()).to.equal(true));
  });

  it('emitters(array) data equal to action', () => {
    const emitters = createEmiters(dispatch, action, rules.emittersArray);

    emitters.forEach(([event, evaluate, data]) => expect(data()).to.equal(action));
  });

  it('emitters(array) without data provided default data equal to action', () => {
    const emitters = createEmiters(dispatch, action, rules.emittersArrayWithoutData);

    emitters.forEach(([event, evaluate, data]) => expect(data()).to.equal(action));
  });

  it('emitters(array) without data provided default data equal to action', () => {
    const emitters = createEmiters(dispatch, action, [
      ['message', e => true, 'plain value'],
    ]);

    emitters.forEach(([event, evaluate, data]) => expect(data()).to.equal('plain value'));
  });
});
