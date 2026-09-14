import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tsParser from '@typescript-eslint/parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';

const browserGlobals = { ...globals.browser, ...globals.es2022 };

export default defineConfig([
  { ignores: ['dist/**', '.astro/**', 'node_modules/**'] },
  js.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: browserGlobals },
  },
  {
    files: ['**/*.ts'],
    languageOptions: { parser: tsParser, sourceType: 'module' },
  },
  {
    files: ['**/*.astro'],
    languageOptions: { globals: browserGlobals },
  },
]);
