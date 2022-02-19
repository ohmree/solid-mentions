import 'vite/client';

interface ImportMeta {
  readonly env: ImportMetaEnv & {
    readonly VITE_TWITCH_CLIENT_ID: string;
  };
}
