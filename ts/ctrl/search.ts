import templater from '../templater';

templater.registerController('search', {
	data: {},

	init() {
		console.log('ctrl.search init');
	},

	done() {
		console.log('ctrl.search done');
	}
});