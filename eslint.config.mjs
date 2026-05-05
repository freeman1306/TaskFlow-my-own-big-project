import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-plugin-prettier'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.next/**', 'public/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  // react.configs.flat.recommended,
  // reactHooks.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs}'],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]
