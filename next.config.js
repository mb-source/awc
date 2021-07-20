const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const config = {};
const plugins = [
	withCss,
	[
		withLess,
		{
			lessLoaderOptions: {
				javascriptEnabled: true,
			},
		},
	],
	[
		withSass,
		{
			cssModules: true,
			allowMultiple: true,
			cssLoaderOptions: {
				importLoaders: 1,
				localIdentName: '[hash:base64:10]',
			},
		},
	],
];
module.exports = withPlugins(plugins, config);