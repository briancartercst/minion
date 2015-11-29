var glob = require("glob");

function getEntries() {
	// Cool pure functional way
	return ['./ts/main'].concat(
		glob.sync('./ts/controllers/*.ts').map(function(ctrl) {
			return ctrl.substr(0, ctrl.length - 3)
		})
	);
}

module.exports = {
	devtool: 'source-map',
	entry: getEntries(),
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