import minion from '../minion';
import userSvc from '../services/users';

minion.registerController('users', {

	preRender() {
		return userSvc.getUsers(minion.model.userFilter).then(users => {
			minion.model.users = users;
		});
	},

	postRender(viewContent: JQuery) {
		handleSearchForm(viewContent);
		handleDeleteButton(viewContent);
	},

	done() {
		$('#modal-delete-btn').unbind('click');
	}

});


function handleSearchForm(viewContent: JQuery) {
	const form = viewContent.find('#user-search-form'); 
	form.submit(() => {
		//TODO refactor modal click handling to new user-table controller
		$('#modal-delete-btn').unbind('click');
		minion.model.userFilter = minion.form2obj(form);
		userSvc.getUsers(minion.model.userFilter)
		.then(users => {
			minion.model.users = users;
			return minion.showView('user-table', $('[mn-view=user-table]'))
		})
		.then(viewContent => handleDeleteButton(viewContent));
		return false;
	});
}

function handleDeleteButton(viewContent: JQuery) {
	let delUserId = null;
	viewContent.find('[data-delete-id]').click(function() {
		delUserId = $(this).attr('data-delete-id');
	});
	$('#modal-delete-btn').click(() => {
		if (!delUserId) return;
		console.log('Deleting user:', delUserId);
		userSvc.deleteUser(delUserId);
	});
}