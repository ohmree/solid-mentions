interface ImportMeta {
  readonly env: import('vite/client').ImportMetaEnv & {
    readonly VITE_TWITCH_CLIENT_ID: string;
  };
}
