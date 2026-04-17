import solid from 'eslint-plugin-solid';
import parser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { solid },
    languageOptions: {
      parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    rules: {
      ...solid.configs.recommended.rules,
    },
  },
];
