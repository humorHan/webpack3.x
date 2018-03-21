module.exports = {
  "globals": {
      "window": true
  },
  "root": true,
  "parser": "babel-eslint",
  "parserOptions": {
      "ecmaVersion": 2017,
      "sourceType": "module"
  },
  "env": {
      "browser": true,
      "node": true
  },
  "extends": [
      "airbnb-base"
  ],
  "plugins": [
      "html",
      "import"
  ],
  "settings": {
      "import/resolver": {
          "node": {},
          "webpack": {
              "config": {
                  "resolve": {
                      "alias": {
                          "demo": "/Users/humorhan/work/projectDemo/src/page"
                      },
                      "extensions": [
                          ".js",
                          ".vue",
                          ".json"
                      ],
                      "modules": [
                          "node_modules"
                      ],
                      "symlinks": false
                  }
              }
          }
      }
  },
  "rules": {
      "import/extensions": [
          0,
          "always",
          {
              "js": "never",
              "vue": "never"
          }
      ],
      "import/no-extraneous-dependencies": [
          "error",
          {
              "optionalDependencies": [
                  "test/unit/index.js"
              ]
          }
      ],
      "no-debugger": 0,
      "no-param-reassign": 1,
      "guard-for-in": 1,
      "consistent-return": 1,
      "no-shadow": 1,
      "import/first": 0,
      "no-unused-vars": 1,
      "no-mixed-spaces-and-tabs": 2,
      "no-use-before-define": 0,
      "no-case-declarations": 1,
      "no-underscore-dangle": 0,
      "indent": [
          "error",
          2,
          {
              "SwitchCase": 1
          }
      ],
      "camelcase": 1,
      "semi": 2,
      "semi-spacing": [
          "error",
          {
              "before": false,
              "after": false
          }
      ],
      "one-var-declaration-per-line": [
          2,
          "always"
      ],
      "yoda": 2,
      "comma-dangle": 0,
      "no-mixed-operators": 1,
      "no-unused-expressions": 0,
      "no-plusplus": 0,
      "no-tabs": [
          "error"
      ],
      "object-shorthand": [
          "error"
      ],
      "one-var": [
          "error",
          "never"
      ],
      "padded-block": 0,
      "prefer-arrow-callback": "error",
      "prefer-const": 0,
      "prefer-rest-params": 0,
      "prefer-spread": "error",
      "prefer-template": "error",
      "quote-props": [
          "error",
          "as-needed"
      ],
      "quotes": [
          "error",
          "single",
          {
              "avoidEscape": true,
              "allowTemplateLiterals": true
          }
      ],
      "radix": 0,
      "space-before-blocks": [
          "error",
          "always"
      ],
      "space-before-function-paren": [
          "error",
          "never"
      ],
      "space-in-parens": [
          "error",
          "never"
      ],
      "space-infix-ops": "error",
      "spaced-comment": [
          "error",
          "always"
      ],
      "wrap-iife": [
          "error",
          "outside"
      ],
      "no-restricted-syntax": [
          "error",
          {
              "selector": "ForOfStatement",
              "message": "for...of is not allowed"
          }
      ],
      "max-len": [
          "warn",
          {
              "comments": 120,
              "code": 200
          }
      ],
      "no-restricted-globals": 1,
      "prefer-destructuring": [
          "off"
      ],
      "prefer-promise-reject-errors": 0,
      "class-methods-use-this": 0,
      "new-cap": 1,
      "import/no-named-as-default-member": 1,
      "no-continue": 1,
      "import/prefer-default-export": 1,
      "arrow-parens": 0,
      "no-fallthrough": 1,
      "no-restricted-properties": 1,
      "array-callback-return": 1,
      "no-bitwise": 1,
      "prefer-default-export": 0
  }
}