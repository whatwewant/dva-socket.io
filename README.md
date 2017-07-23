<!--
@Author: eason
@Date:   2017-07-19T17:50:07+08:00
@Email:  uniquecolesmith@gmail.com
@Last modified by:   eason
@Last modified time: 2017-07-23T18:51:19+08:00
@License: MIT
@Copyright: Eason(uniquecolesmith@gmail.com)
-->

# dva-socket.io
[![Build Status](https://travis-ci.org/whatwewant/dva-socket.io.svg?branch=master)](https://travis-ci.org/whatwewant/dva-socket.io)
[![Coverage Status](https://coveralls.io/repos/github/whatwewant/dva-socket.io/badge.svg)](https://coveralls.io/github/whatwewant/dva-socket.io)
[![NPM downloads](https://img.shields.io/npm/v/dva-socket.io.svgd)](https://npmjs.org/package/dva-socket.io)

A socket.io plugin for dva [dva](https://github.com/dvajs/dva) or **Redux**.

## Usage

```javascript
// Simple Usage
import dva from 'dva';
import createSocket from 'dva-socket.io';

const app = dva();

app.use(createSocket({
  // when server push an server-message event,
  //  it will dispatch an action use server data,
  on: ['server-message'],
  emit: [
    // when you dispatch an action with type === 'send-message',
    //  it will emit a client-message event with data('client send a message')
    [
      'client-message',
      (action) => action.type === 'send-message',
      'client send a message',
    ],
  ],
}));
```

```javascript
// Normal Usage (Recommend)
import dva from 'dva';
import createSocket from 'dva-socket.io';

const app = dva();

app.use(createSocket({
  // when server push an server-message event,
  //  it will dispatch an action use server data,
  on: {
    'server-message': (data, dispatch) => dispatch(data),
  },
  emit: [
    // when you dispatch an action with type === 'send-message',
    //  it will emit a client-message event with data('client send a message')
    'client-message': {
      evaluate: (action) => action.type === 'send-message',
      data: (action) => 'client send a message',
    },
  ],
}));
```

```javascript
// With Async Service
import dva from 'dva';
import createSocket from 'dva-socket.io';

const app = dva();

app.use(createSocket({
  asyncs: [
    {
      evaluate: (action, dispatch) => true,
      request: async (action, dispatch) => {
        const data = await = fetch(action.payload.url);
        dispatch(data);
      },
    },
  ],
}));
```

## Api

### `createSocket(url, options, rules)`
- @param `url: String`:  socket.io url
- @param `options: Object`: socket.io options
- @param `rules: Object`: listeners(on), emitters(emit)
	- `on: Object | Array`
    - `key: String | number` as a listen event name
    - `value: Function` as a listen handle function
      - @params `data: Server Push Value`
      - @params `dispatch: Redux dispatch Function`
  - `emit: Object | Array`
    - `key: String` as a listen event name
    - `value: Object` as an Object { evaluate, data }
      - `evaluate: Function` as a validate function, only if evaluate return `true`, it will emit a `key` event with `data`
        - @params `action: Redux dispatched Action`
        - @params `dispatch: Redux dispatch Function`
      - `data: Function | Value` as a emit data provider
        - @params `action: Server Push Value`
  - `asyncs: Array`
    - `evaluate: Function` as a validate function, only if evaluate return `true`, it will call `request`
      - @params `action: Redux dispatched Action`
      - @params `dispatch: Redux dispatch Function`
    - `request: Async Function` as async request service
      - @params `action: Redux dispatched Action`
      - @params `dispatch: Redux dispatch Function`
- @return `DVA PLUGIN`
