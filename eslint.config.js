// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  ignores: ['dist/**', 'node_modules/**'],
  files: ['src/**/*.ts'], // if you have js files too
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: './tsconfig.json',
      allowDefaultProject: true,
    },
    globals: {
      window: true,
      document: true,
    },
    ecmaVersion: 2021,
  },
  rules: {
    'no-const-assign': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
