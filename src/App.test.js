import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('opens websocket successfully', () => {
  const websocketurl = "ws://stocks.mnet.website";
  const socket = new WebSocket(websocketurl);
  expect(socket.readyState).not.toBe(3);
  socket.onmessage = (message) => {
    expect.any(message.data);
  };
});
