import minion from '../minion';
import userSvc from '../services/users';

minion.component('user-edit', {
	init(id: string) {
		// TODO adapt
		// this.user = minion.rootModel.users[id];
	},
	save(elem) {
		// TODO adapt
		// userSvc.saveUser(<any>minion.form2obj(elem)).then(() => {
		// 	window.location.href = '#users';
		// });
		return false;
	}
});
