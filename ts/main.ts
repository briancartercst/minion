import templater from './templater';

const view = $('#view');

$(() => {
	routie({
		'': () => routie('search'),
		'search': () => templater.showPage('search', view),
		'users': () => templater.showPage('users', view),
		'details/:id': (id) => templater.showPage('details', view)
	});
});
