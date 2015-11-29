import templater from '../templater';

templater.registerController('search', {
	data: {},

	postRender() {
		console.log('ctrl.search postRender');
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