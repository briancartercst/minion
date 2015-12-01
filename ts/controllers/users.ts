import minion from '../minion';
import userSvc from '../services/users';

minion.registerController('users', {

	preRender() {
		return userSvc.getUsers(minion.model.userFilter).then(users => {
			minion.model.users = users;
		});
	},

	postRender(viewContent: JQuery) {
		handleSearchForm(viewContent);
		handleDeleteButton(viewContent);
	}

});


function handleSearchForm(viewContent: JQuery) {
	const form = viewContent.find('#user-search-form'); 
	form.submit(() => {
		minion.model.userFilter = minion.form2obj(form);
		userSvc.getUsers(minion.model.userFilter).then(users => {
			minion.model.users = users;
			minion.showPage('user-table', $('[mn-view=user-table]'));
		});
		return false;
	});
}

function handleDeleteButton(viewContent: JQuery) {
	viewContent.find('[data-delete-id]').click(function() {
		console.log('user delete clicked for id', $(this).attr('data-delete-id'));
	});
}