import { SalteAuth } from '@salte-auth/salte-auth';
import type { Component } from 'solid-js';
import { Redirect } from '@salte-auth/redirect';
import { Button } from 'solid-bootstrap';
import { useAuth } from '~/services/auth';
import { Navigate } from 'solid-app-router';
import type { AccessToken } from '@salte-auth/salte-auth/dist/utils';
import Twitch from '~/util/salte-twitch';

const Login: Component = () => {
  const authService = useAuth();
  const auth = new SalteAuth({
    providers: [
      new Twitch({
        clientID: import.meta.env.VITE_TWITCH_CLIENT_ID as string,
        scope: 'user:read:follows',
        responseType: 'token',
        redirectUrl: 'http://localhost:3000',
        validation: false,
      }),
    ],
    handlers: [
      new Redirect({
        default: true,
      }),
    ],
  });

  auth.on('login', (error, data) => {
    if (error || !data) {
      console.error(error);
    } else {
      const accessToken = (data?.data as unknown as AccessToken | undefined)
        ?.raw;
      if (accessToken) {
        authService().login(accessToken);
      }
    }
  });

  return (
    <$show when={!authService().isLoggedIn} fallback={<Navigate href="/" />}>
      <Button
        variant="primary"
        onClick={async () => await auth.login('twitch')}
      >
        Sign in
      </Button>
    </$show>
  );
};

export default Login;
