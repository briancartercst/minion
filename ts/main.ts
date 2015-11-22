/// <reference path="../tsd/es6-promise.d.ts" />
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../tsd/bootstrap-slider.d.ts" />
/// <reference path="../tsd/routie.d.ts" />

// Define controller module with dummy export, to allow dynamic module loading
//module ctrl { export var dummy = null; }
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
