var glob = require("glob");

function getEntries() {
	// Cool pure functional way
	return ['./ts/main'].concat(
		glob.sync('./ts/ctrl/*.ts').map(function(ctrl) {
			return ctrl.substr(0, ctrl.length - 3)
		})
	);
	// Uncool imperative way
	/* var result = ['./ts/main'];
	var controllers = glob.sync('./ts/ctrl/*.ts');
	for (var i = 0; i < controllers.length; i++) {
		var ctrl = controllers[i];
		result.push(ctrl.substr(0, ctrl.length - 3));
	}
	return result; */
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