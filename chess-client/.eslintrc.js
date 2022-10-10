module.exports = {
  extends: [
    "react-app",
    "react-app/jest",
    "airbnb",
    "airbnb-typescript"
  ],
  parserOptions: {
    project: "./tsconfig.json"
  },
  ignorePatterns: [
    ".eslintrc.js",
    "webpack.config.js"
  ],
  overrides: [
    {
      files: [
        "**/*.ts?(x)"
      ],
      rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
        "no-unused-vars": process.env.NODE_ENV === "production" ? "error" : "warn",
        "@typescript-eslint/no-unused-vars": process.env.NODE_ENV === "production" ? "error" : "warn",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
        "react/jsx-one-expression-per-line": 0,
        "import/prefer-default-export": 0,
        "react/jsx-props-no-spreading": 0,
        "react/function-component-definition": [
          "warn",
          {
            "namedComponents": "arrow-function",
            "unnamedComponents": "arrow-function"
          }
        ],
        "object-curly-newline": [
          "error",
          {
            "ImportDeclaration": {
              "minProperties": 5,
              "consistent": false,
              "multiline": true
            }
          }
        ],
        "react/jsx-no-useless-fragment": [
          "error",
          {
            "allowExpressions": true
          }
        ],
        "linebreak-style": 0,
        'max-len': ["error", 200],
        "react-hooks/exhaustive-deps": "off",
        "react/react-in-jsx-scope": "off",
        "semi": ["error", "never"],
        "@typescript-eslint/semi": ["error", "never"],
        "@typescript-eslint/no-shadow": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "import/no-cycle": "off",
        "no-nested-ternary": "off",
        "no-underscore-dangle": "off",
      }
    }
  ]
}
