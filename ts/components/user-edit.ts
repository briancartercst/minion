import minion from '../minion';
import userSvc from '../services/users';

minion.component('user-edit', {
	init() {
		this.user = this.userAdmin.users[this.userAdmin.userId];
	},
	save(elem) {
		userSvc.saveUser(<any>minion.form2obj(elem)).then(() => {
			window.location.href = '#users';
		});
		return false;
	}
});
