import minion from './minion';

const view = $('#view');

$(() => {
	routie({
		'': () => routie('search'),
		'search': () => minion.showPage('search', view),
		'users': () => minion.showPage('users', view),
		'user/:id': (id) => minion.showPage('user-edit', view, id),
		'details/:id': (id) => minion.showPage('details', view)
	});
});
