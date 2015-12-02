import minion from '../minion';
import userSvc from '../services/users';

minion.registerController('user-edit', {
	preRender(id: string) {
		minion.model.user = minion.model.users[id];
	},
	save() {
		minion.model.user = minion.form2obj($(this));
		userSvc.saveUser(minion.model.user).then(() => {
			window.location.href = '#users';
		});
		return false;
	}
});
