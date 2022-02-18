import {
  Handler,
  SalteAuthError,
  Utils,
  OAuth2Provider,
  OpenIDProvider,
} from '@salte-auth/salte-auth';
import { WebviewWindow } from '@tauri-apps/api/window';

export class Tauri extends Handler {
  public constructor(config?: Tauri.Config) {
    super(config);

    this.config = Utils.Common.defaults(this.config, {
      window: {
        name: 'salte-tauri',
        height: 600,
        width: 600,
      },
    });
  }

  public get name(): string {
    return 'tauri';
  }

  public get auto(): boolean {
    return false;
  }

  public async open(
    options: Handler.OpenOptions,
  ): Promise<OAuth2Provider.Validation | OpenIDProvider.Validation> {
    const { url } = options;
    const { name: title, height, width } = this.config.window ?? {};
    const webview = new WebviewWindow('salte-tauri', {
      url,
      title,
      height,
      width,
      alwaysOnTop: true,
      center: true,
      decorations: true,
      focus: true,
      resizable: false,
      skipTaskbar: false,
    });

    webview.once('tauri://error', () => {
      throw new SalteAuthError({
        message:
          'We were unable to open the popup window, its likely that the request was blocked.',
        code: 'popup_blocked',
      });
    });

    // TODO: Find a better way of tracking when a Window closes.
    return new Promise((resolve, reject) => {
      webview.once('tauri://created', () => {
        const location = new Location();
        location.href = url;

        const parsed = Utils.URL.parse(location);

        webview.close();
        resolve(parsed);
      });
    });
  }
}

export interface Tauri {
  config: Tauri.Config;
}

export declare namespace Tauri {
  export interface Config extends Handler.Config {
    /**
     * The popup window configuration.
     */
    window?: {
      /**
       * The name to attach to the popup window.
       *
       * @default 'salte-tauri'
       */
      name?: string;

      /**
       * The height of the popup window.
       *
       * @default 600
       */
      height?: number;

      /**
       * The width of the popup window.
       *
       * @default 600
       */
      width?: number;
    };
  }
}
