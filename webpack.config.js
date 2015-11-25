module.exports = {
	devtool: 'source-map',
	entry: ['./ts/main', './ts/ctrl/search'],
	output: {
		path: __dirname + '/js',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.ts']
	},
	module: {
		loaders: [
			{
				test: /\.ts$/,
				loader: 'ts-loader'
			}
		]
	}
};