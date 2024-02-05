module.exports = {
  extends: [
    "plugin:prettier/recommended", 
    "plugin:@typescript-eslint/recommended", 
    "plugin:storybook/recommended",
    "plugin:import/recommended"
  ],
  plugins: [
    "import"
  ],
  rules: {
    // "import/no-extraneous-dependencies": ["error"],
    "import/no-unresolved": ["off"],
    // "import/no-relative-packages": "error",
    // "import/no-unused-modules": [1, {"unusedExports": true}],
    // "import/no-internal-modules": ["error", {
    //   "allow": [
    //     "**/actions/*", 
    //     "source-map-support/*"
    //   ],
    // }],
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/no-non-null-assertion": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/member-delimiter-style": ["off"],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/ban-ts-ignore': ['off'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/ban-types': ['off'],
    "prettier/prettier": ["warn", {
      singleQuote: true,
      semi: false,
      printWidth: 110,
      endOfLine: 'auto'
    }],
    '@typescript-eslint/no-extra-semi': ['off'],
    "spaced-comment": ["error", "always", {
      "markers": ["/"]
    }]
  },
  settings: {},
  ignorePatterns: ["*.js", "dist"]
};