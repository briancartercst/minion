import minion from '../minion';
import userSvc from '../services/users';

minion.registerController('users', {
	preRender() {
		return userSvc.getUsers(this.userFilter).then(users => {
			minion.rootModel.users = users;
		});
	},
	searchUsers(elem) {
		this.userFilter = minion.form2obj(elem);
		userSvc.getUsers(this.userFilter).then(users => {
			minion.rootModel.users = users;
			minion.showView('user-table');
		});
		return false;
	}
});

minion.registerController('user-table', {
	postRender(viewContent: JQuery) {
		handleDeleteButton(viewContent);
	},
	done() {
		$('#modal-delete-btn').unbind('click');
	}
});


//--------------------------------------------------

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