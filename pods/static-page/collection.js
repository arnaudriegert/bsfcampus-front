define(
	[
		'jquery',
		'underscore',
		'backbone',
		'app/config',
		
		'collection',
		
		'pods/static-page/model'
	],
	function($, _, Backbone, Config,
		AbstractCollection,
		StaticPageModel
		) {

		return AbstractCollection.extend({

			model: StaticPageModel,

            dsResourceName: Config.constants.dsResourceNames.STATIC_PAGE,

			serverPath: '/static_page'

		});

	}
);
