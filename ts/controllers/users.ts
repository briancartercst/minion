import minion from '../minion';
import userSvc from '../services/users';

minion.registerController('users', {
	preRender() {
		return userSvc.getData().then(users => {
			minion.model.users = users;
		});
	}
});
