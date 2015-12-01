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
		minion.model.userFilter = minion.form2obj(form);
		userSvc.getUsers(minion.model.userFilter).then(users => {
			minion.model.users = users;
			minion.showView('user-table', $('[mn-view=user-table]'));
		});
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