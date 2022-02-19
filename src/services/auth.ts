import { ServiceInitializer, useService } from 'solid-services';
import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { createStore, DeepReadonly, produce } from 'solid-js/store';

const AuthService: ServiceInitializer<{
  get client(): DeepReadonly<ApiClient> | undefined;
  get isLoggedIn(): boolean;
  login(accessToken: string): void;
  logout(): void;
}> = () => {
  const [state, setState] = createStore<{
    accessToken?: string;
    apiClient?: ApiClient;
    authProvider?: StaticAuthProvider;
  }>({});

  return {
    get client() {
      return state?.apiClient;
    },

    get isLoggedIn() {
      return state.apiClient ? true : false;
    },

    login(accessToken: string) {
      const authProvider = new StaticAuthProvider(
        import.meta.env.VITE_TWITCH_CLIENT_ID as string,
        accessToken,
        ['user:read:follows'],
        'user',
      );
      const apiClient = new ApiClient({ authProvider });
      setState('accessToken', accessToken);
      setState('authProvider', authProvider);
      setState('apiClient', apiClient);
    },

    logout() {
      setState('accessToken', undefined);
      setState('authProvider', undefined);
      setState('apiClient', undefined);
    },
  };
};

export default AuthService;
export const useAuth = () => useService(AuthService);
