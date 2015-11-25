import templater from './templater';

const view = $('#view');

$(() => {
	routie({
		'': () => {
			routie('search');
		},
		'search': () => {
			templater.showPage('search', view);
		},
		'details/:id': (id) => {
			templater.showPage('details', view);
		}
	});
});
