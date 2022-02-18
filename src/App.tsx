import type { Component } from 'solid-js';
import { TwitchChatProvider } from './providers/TwitchChat';
/* import Counter from './components/Counter'; */
import { Route, Routes } from 'solid-app-router';
const Mentions = $lazy(import('./pages/Mentions'));
const Login = $lazy(import('./pages/Login'));

const App: Component = () => {
  return (
    <TwitchChatProvider
      options={{ channels: ['ohmree'], readOnly: true, webSocket: true }}
    >
      <Routes>
        <Route path="/" element={<Mentions />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </TwitchChatProvider>
  );
};

export default App;
