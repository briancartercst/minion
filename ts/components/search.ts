import minion from '../minion';

minion.component('search', class {
	potato: string;

	init() {
		this.potato = "I am a potato";
	}

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
});
