import minion from '../minion';
import userSvc from '../services/users';

minion.component('users', class {
	searchUsers(elem) {
		// TODO adapt
		// minion.rootModel.userFilter = minion.form2obj(elem);
		// minion.showView('user-table');
		return false;
	}
});

minion.component('user-table', {
	init() {
		// TODO adapt
		return userSvc.getUsers(null/*minion.rootModel.userFilter*/).then(users => {
			// 	minion.rootModel.users = users;
			this.users = users;
		});
	},
	ready(viewContent: JQuery) {
		$('#modal-delete-btn').click(() => {
			if (!this.delUserId) return;
			console.log('Deleting user:', this.delUserId);
			userSvc.deleteUser(this.delUserId);
		});
	},
	done() {
		$('#modal-delete-btn').unbind('click');
	},
	openDeletePopup(button) {
		this.delUserId = button.attr('data-delete-id');
	}
});
