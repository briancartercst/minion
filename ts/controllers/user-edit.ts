import minion from '../minion';
import userSvc from '../services/users';

minion.registerController('user-edit', {
	preRender(id: string) {
		this.user = this.$parent.users[id];
	},
	save() {
		this.user = minion.form2obj($(this));
		userSvc.saveUser(this.user).then(() => {
			window.location.href = '#users';
		});
		return false;
	}
});
