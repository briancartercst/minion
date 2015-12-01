import minion from '../minion';
import userSvc from '../services/users';

minion.registerController('users', {

	preRender() {
		return userSvc.getUsers(minion.model.userFilter).then(users => {
			minion.model.users = users;
		});
	},

	postRender(viewContent: JQuery) {
		const form = viewContent.find('#user-search-form'); 
		form.submit(() => {
			const userSearchFilter = minion.form2obj(form);
			return false;
		});
	}

});
