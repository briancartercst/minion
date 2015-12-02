import minion from '../minion';
import userSvc from '../services/users';

minion.controller('user-edit', {
	preRender(id: string) {
		this.user = minion.rootModel.users[id];
	},
	save(elem) {
		userSvc.saveUser(<any>minion.form2obj(elem)).then(() => {
			window.location.href = '#users';
		});
		return false;
	}
});
