import templater from '../templater';

templater.registerController('search', {
	data: {},

	init() {
		console.log('ctrl.search init');
		$('#price-range').slider({});
		$('.slider-selection').css({
			backgroundImage: 'initial',
			backgroundColor: '#AAA'
		});
	},

	done() {
		console.log('ctrl.search done');
	}
});