import minion from '../minion';

minion.registerController('search', {
	data: {},

	postRender() {
		console.log('ctrl.search postRender');
		$('#price-range').slider({});
		$('.slider-selection').css({
			backgroundImage: 'initial',
			backgroundColor: '#AAA'
		});
		minion.subscribe('user.search', searchHandler);
	},

	done() {
		console.log('ctrl.search done');
		minion.unsubscribe('user.search', searchHandler);
	}
});


function searchHandler(name, event) {
}