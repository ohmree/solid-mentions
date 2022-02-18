import { Handler, SalteAuthError, Utils } from '@salte-auth/salte-auth';
import { tauri } from '@tauri-apps/api';
import { Store } from 'tauri-plugin-store-api';

export class Tauri extends Handler {
  public constructor(config?: Tauri.Config) {
    super({ ...config, navigate: 'reload' });

    this.tauriStore = new Store('.settings.dat');

    this.config = Utils.Common.defaults(this.config, {
      timeout: 10000,
    });
  }

  public get name(): string {
    return 'tauri';
  }

  public get auto(): boolean {
    return true;
  }

  public connected({ action }: Handler.ConnectedOptions): any {
    return new Promise<void>(async (resolve, _reject) => {
      if (!action) return resolve();

      const origin = await this.tauriStore.get<string>('origin');

      if (!origin) return resolve();

      await this.tauriStore.delete('origin');

      if (action === 'login') {
        // Does it make sense to navigate on 'logout'?
        // NOTE: This order, matters since navigate modifies the location.
        const parsed = Utils.URL.parse(location);
        this.navigate(origin);
        return resolve(parsed);
      }
    });
  }

  public open({
    url,
    timeout = this.config.timeout,
  }: Tauri.OpenOptions): Promise<void> {
    let location = document.location.href;
    if (!location.endsWith('/')) {
      location += '/';
    }
    void tauri.invoke('save_location', { location });
    this.navigate(url);

    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(
          new SalteAuthError({
            code: 'redirect_timeout',
            message: `Timed out while redirecting.`,
          }),
        );
      }, timeout);
    });
  }
}

export interface Tauri {
  config: Tauri.Config;
  tauriStore: Store;
}

export declare namespace Tauri {
  export interface Config extends Handler.Config {
    /**
     * The amount of time in ms before any login / logout requests will timeout.
     *
     * @default 10000
     */
    timeout?: number;
  }

  export interface OpenOptions extends Handler.OpenOptions {
    /**
     * Override the configured timeout.
     */
    timeout?: number;
  }
}
