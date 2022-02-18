import { HelixUser } from '@twurple/api/lib';
import { createSignal } from 'solid-js';
import { ServiceInitializer, useService } from 'solid-services';

const AuthService: ServiceInitializer<{
  get user(): HelixUser | undefined;
  login(user: HelixUser): void;
  logout(): void;
}> = () => {
  const [user, setUser] = createSignal<HelixUser | undefined>();

  return {
    get user() {
      return user();
    },

    login(user: HelixUser) {
      setUser(user);
    },

    logout() {
      setUser(undefined);
    },
  }
}

export default AuthService;
export const useAuth = () => useService(AuthService);
