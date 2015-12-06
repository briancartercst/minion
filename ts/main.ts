import minion from './minion';

setupLoadingPopup();
const view = $('#view');
const appModel = {
	userAdmin: {
		users: [],
		searchFilter: {}
	}
};

$(() => {
	routie({
		'': () => routie('search'),
		'search': () => minion.render('search', view),
		'users': () => minion.render('users', view), //appModel, 'userAdmin'),
		//TODO think of a clean way to pass "id" and other route parameters
		'user/:id': (id) => minion.render('user-edit', view),
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
