import templater from './templater';

const view = $('#view');

$(() => {
	routie({
		'': () => routie('search'),
		'search': () => templater.showPage('search', view),
		'users': () => templater.showPage('users', view),
		'user/:id': (id) => templater.showPage('user', view),
		'details/:id': (id) => templater.showPage('details', view)
	});
});
