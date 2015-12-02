import minion from '../minion';

minion.registerController('search', {
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
	},

	hello(evt) {
		alert('hello!');
		console.log(evt);
	}
});
