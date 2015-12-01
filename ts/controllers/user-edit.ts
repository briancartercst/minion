import minion from '../minion';
import userSvc from '../services/users';

minion.registerController('user-edit', {
	preRender(id: string) {
		minion.model.user = minion.model.users[id];
	},

	postRender(viewContent: JQuery) {
		handleEditForm(viewContent);
	}});



function handleEditForm(viewContent: JQuery) {
	const form = viewContent.find('#user-edit-form'); 
	form.submit(() => {
		userSvc.saveUser(minion.model.user).then(() => {
			window.location.href = '#users';
		});
		return false;
	});
}