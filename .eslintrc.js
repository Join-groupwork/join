module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  rules: {
    "padding-lines-between-statements": [
      "error",
      { blankLine: "always", prev: "function", next: "*" },
      { blankLine: "always", prev: "*", next: "function" }
    ],
    "no-multiple-empty-lines": ["error", { max: 1 }]
  }
};
