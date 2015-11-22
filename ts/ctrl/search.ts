import templater from '../templater';

templater.registerController('search', {
	data: {},

	init() {
		console.log('ctrl.search init');
		$("#price-range").slider({});
	},

	done() {
		console.log('ctrl.search done');
	}
});