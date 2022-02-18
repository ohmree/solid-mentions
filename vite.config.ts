import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import solidLabels from 'babel-plugin-solid-labels';
import { undestructurePlugin } from 'babel-plugin-solid-undestructure';
import type { Options as SolidLabelsOptions } from 'babel-plugin-solid-labels/dist/types/types';
import icons from 'unplugin-icons/vite';
import iconsResolver from 'unplugin-icons/resolver';
import autoImport from 'unplugin-auto-import/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    ...undestructurePlugin('ts'),
    solid({
      babel: {
        plugins: [
          [
            solidLabels,
            <SolidLabelsOptions>{ dev: process.env.NODE_ENV !== 'production' },
          ],
        ],
      },
    }),
    autoImport({
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        globalsPropValue: 'readonly',
      },
      resolvers: [
        iconsResolver({
          prefix: false,
          enabledCollections: 'bi',
        }),
      ],
    }),
    icons({
      compiler: 'solid',
      autoInstall: false,
    }),
    tsconfigPaths(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    }
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
