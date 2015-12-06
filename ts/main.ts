import minion from './minion';

setupLoadingPopup();
const view = $('#view');
const appModel = {
	userAdmin: {
		userId: null,
		users: [],
		searchFilter: {}
	}
};

$(() => {
	routie({
		'': () => routie('search'),
		'search': () => minion.render('search', view),
		'users': () => minion.render('users', view, appModel, 'userAdmin'),
		'user/:id': (id) => {
			appModel.userAdmin.userId = id;
			minion.render('user-edit', view, appModel, 'userAdmin');
		},
		'details/:id': (id) => minion.render('details', view)
	});
});


function setupLoadingPopup() {
	var isLoading = false;
	const LOAD_POPUP_DELAY = 100;

	minion.showLoading = function() {
		isLoading = true;
		setTimeout(function() {
			if (!isLoading) return;
			$('#loading-cover').show();
			$('#loading-popup').show();
		}, LOAD_POPUP_DELAY);
	};

	minion.hideLoading = function() {
		isLoading = false;
		$('#loading-cover').hide();
		$('#loading-popup').hide();
	}
}
