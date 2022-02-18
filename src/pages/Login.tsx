import { OAuth2Provider, SalteAuth } from '@salte-auth/salte-auth';
import type { Component } from 'solid-js';
import { Tauri } from '~/salte-tauri';
import { Button } from 'solid-bootstrap';
import { useAuth } from '~/services/auth';
import { Navigate } from 'solid-app-router';

class Twitch extends OAuth2Provider {
  constructor(config: Twitch.Config) {
    super({ ...config, url: 'https://id.twitch.tv/oauth2' });
  }

  /**
   * This is the default name of the provider.
   */
  get name() {
    return 'twitch';
  }

  /**
   * This should use `this.config.url` to build the provider-specific login url.
   */
  get login() {
    return this.url(`${this.config.url}/authorize`, {
      client_id: this.config.clientID,
    });
  }
}

interface Twitch {
  config: Twitch.Config;
}

declare namespace Twitch {
  interface Config extends OAuth2Provider.Config {}
}

const Login: Component = () => {
  const authService = useAuth();
  const auth = new SalteAuth({
    providers: [
      new Twitch({
        clientID: import.meta.env.VITE_TWITCH_CLIENT_ID! as string,
        scope: 'user:read:follows',
        responseType: 'token',
        redirectUrl: 'http://localhost',
      }),
    ],
    handlers: [
      new Tauri({
        default: true,
      }),
    ],
  });
  const getAccessToken = () => {
    const { accessToken } = auth.provider('twitch') as Twitch;
    if (accessToken && Object.values(accessToken).some(v => !v)) {
      return undefined;
    } else {
      return accessToken;
    }
  };

  const [state, setState] = $store({
    token: getAccessToken(),
  });

  $(() => {
    auth.on('login', (error, data) => {
      if (error || !data) {
        console.error(error);
      } else {
        setState('token', getAccessToken());
      }
    });
  });

  const loginButton = () => (
    <Button variant="primary" onClick={async () => await auth.login('twitch')}>
      Sign in
    </Button>
  );

  return (
    <$show when={!authService().user} fallback={<Navigate href="/" />}>
      <$show when={state.token} fallback={loginButton}>
        <Button
          onClick={() => {
            setState('token', undefined);
          }}
        >
          Sign out
        </Button>
        Your token is <code>{JSON.stringify(state.token)}</code>
      </$show>
    </$show>
  );
};

export default Login;
