import { OAuth2Provider } from '@salte-auth/salte-auth';

export default class Twitch extends OAuth2Provider {
  constructor(config: Twitch.Config) {
    super({
      ...config,
      url: 'https://id.twitch.tv/oauth2',
    });
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
    return this.url(`${this.config.url}/authorize`);
  }
}

export default interface Twitch {
  config: Twitch.Config;
}

declare namespace Twitch {
  interface Config extends OAuth2Provider.Config {}
}
