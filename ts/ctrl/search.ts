import templater from '../templater';

templater.addController('search', {
	data: {},

	init() {
		console.log('ctrl.search init');
	},

	done() {
		console.log('ctrl.search done');
	}
});