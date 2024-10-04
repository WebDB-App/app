module.exports = {
	'env': {
		'es2021': true,
		'node': true
	},
	'extends': 'eslint:recommended',
	'overrides': [],
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'rules': {
		'no-async-promise-executor': 0,
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			process.platform === 'win32' ? 'windows' : 'unix'
		],
		'quotes': [
			'warn',
			'double'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
