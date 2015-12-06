import minion from '../minion';

minion.component('search', class {
	ready() {
		console.log('search ready', arguments);
		$('#price-range').slider({});
		$('.slider-selection').css({
			backgroundImage: 'initial',
			backgroundColor: '#AAA'
		});
	}

	hello(evt) {
		alert('hello!');
		console.log(evt);
	}

	done() {
		console.log('search done', arguments);
	}
});
