import { useTwitchChat } from '../providers/TwitchChat';
import { Component } from 'solid-js';
import { Spinner } from 'solid-bootstrap';

const Counter: Component = () => {
  const [store, { isConnected }] = useTwitchChat()!;
  if (!store.client) return 'No client';
  const [state, setState] = $store<{ messages: string[] }>({ messages: [] });
  store.client.onMessage((_channel, user, message, _object) => {
    setState($produce(s => s.messages.push(`${user} - ${message}`)));
  });

  $computed(async () => {
    if (!isConnected()) {
      await store.client.connect();
    }
  });

  const spinner = () => (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );

  return (
    <>
      <h1>{isConnected() ? 'Connected' : 'Disconnected'}</h1>
      <$show when={isConnected()} fallback={spinner}>
        <ul>
          <$for each={state.messages}>{(message: string) => <li>{message}</li>}</$for>
        </ul>
      </$show>
    </>
  );
};

export default Counter;
