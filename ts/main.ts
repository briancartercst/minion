/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../tsd/routie.d.ts" />

// Define controller module with dummy export, to allow dynamic module loading
//module ctrl { export var dummy = null; }
import templater from './templater';

(function() {	//TODO replace this IIF with build step, to encapsulate modules too

const view = $('#view');

$(() => {
	//TODO show waiting animation & block current UI
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

})();
