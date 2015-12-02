import minion from './minion';

const view = $('#view');

$(() => {
	routie({
		'': () => routie('search'),
		'search': () => minion.showView('search', view),
		'users': () => minion.showView('users', view),
		'user/:id': (id) => minion.showView('user-edit', view, id),
		'details/:id': (id) => minion.showView('details', view)
	});
});
