/**
* @Author: eason
* @Date:   2017-07-19T17:50:07+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-07-23T18:44:47+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import chai from 'chai';
import spies from 'chai-spies';
import { createAsyncs, createMiddleware } from '../src/index';

chai.use(spies)
const expect = chai.expect;

const delay = () => new Promise((resolve) => setTimeout(resolve, 100));

const service = {
  async post() {
    await delay(100);
    return 'after 100ms, get result.';
  },
};

describe('create asyncs', () => {
  // fake history
  let rules;
  let dispatch;
  let action;
  let next;
  beforeEach(() => {
    next = e => e;
    dispatch = e => e;
    action = 'action';
    rules = {
      asyncs: [
        {
          evaluate: (action, dispatch) => true,
          request: async (action, dispatch) => service.post(),
        },
      ],
    };
  });

  // object

  it('asyncs should be an array.', () => {
    expect(() => createAsyncs(dispatch, action, {})).to.throw(/createAsyncs: asyncs should be an array!/);
  });

  it('asyncs should call evaluate, but not call request', () => {
    const evaluate = chai.spy(() => false);
    const request = chai.spy(() => ({}));
    createMiddleware('', {}, {
      asyncs: [
        { evaluate, request },
      ],
    })({ dispatch })(next)(action);

    expect(evaluate).to.have.been.called();
    expect(request).to.not.have.been.called();
  });

  it('asyncs should call evaluate, then call request', () => {
    const evaluate = chai.spy(() => true);
    const request = chai.spy(() => ({}));
    createMiddleware('', {}, {
      asyncs: [
        { evaluate, request },
      ],
    })({ dispatch })(next)(action);

    expect(evaluate).to.have.been.called();
    expect(request).to.have.been.called();
  });

  it('asyncs should call evaluate, then call request', () => {
    const evaluate = chai.spy(() => true);
    const request = chai.spy(() => ({}));
    createMiddleware('', {}, {
      asyncs: [
        { evaluate, request },
      ],
    })({ dispatch })(next)(action);

    expect(evaluate).to.have.been.called();
    expect(request).to.have.been.called();
  });

  it('asyncs should array of { evaluate, request }', () => {
    const evaluate = chai.spy(() => true);
    const request = chai.spy(() => ({}));
    const evaluate1 = chai.spy(() => false);
    const request1 = chai.spy(() => ({}));
    createMiddleware('', {}, {
      asyncs: [
        { evaluate, request },
        { evaluate: evaluate1, request: request1 },
      ],
    })({ dispatch })(next)(action);

    expect(evaluate).to.have.been.called();
    expect(request).to.have.been.called();

    expect(evaluate1).to.have.been.called();
    expect(request1).to.not.have.been.called();
  });
});
