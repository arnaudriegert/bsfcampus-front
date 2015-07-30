define(
    [
        'jquery',
        'underscore',
        'backbone',
        'app/config',

        'model'
    ],
    function($, _, Backbone, Config,
             AbstractModel
    ) {

        return AbstractModel.extend({

            serverPath: '/users',

            dsResourceName: Config.constants.dsResourceNames.USER

        });

    }
);
