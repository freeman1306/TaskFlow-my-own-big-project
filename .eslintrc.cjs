module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],

  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: ['react', 'react-hooks', 'import', 'jsx-ally', 'prettier'],

  rules: {
    'prettier/prettier': 'error',

    'react/react-in-jsx-scope': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-props-no-spreading': 'off',
  },
}
