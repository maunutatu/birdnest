module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'overrides': [
    ],
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'plugins': [
        'react'
    ],
    'rules': {
        'indent': [
            'error',
            2
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        "object-curly-spacing": [
            "error", "never"
        ],
        "arrow-spacing": [
            "error", { "before": true, "after": true }
        ],
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off"
    }
}
