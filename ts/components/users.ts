import minion from '../minion';
import userSvc from '../services/users';

minion.component('users', class {
	userAdmin;
	searchUsers(elem) {
		this.userAdmin.searchFilter = minion.form2obj(elem);
		minion.render('user-table', $('user-table'), this);
		return false;
	}
});

minion.component('user-table', {
	init() {
		return userSvc.getUsers(this.userAdmin.searchFilter).then(users => {
			this.userAdmin.users = users;
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
