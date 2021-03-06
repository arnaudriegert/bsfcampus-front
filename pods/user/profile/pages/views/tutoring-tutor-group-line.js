define(
    [
        'jquery',
        'underscore',
        'backbone',
        'app/config',

        'pods/user/models/current',

        'text!pods/user/profile/pages/templates/tutoring-tutor-group-line.html'

    ],
    function ($, _, Backbone, Config,
              currentUser,
              template) {

        return Backbone.View.extend({

            template: _.template(template),

            className: 'list-group-item container-fluid',

            events: {
                'click button.remove': 'removeTutor'
            },

            render: function () {
                var html = this.template({
                    user: this.model.toJSON(true),
                    config: Config
                });
                this.$el.html(html);

                return this;
            },

            removeTutor: function (e) {
                e.preventDefault();

                this.trigger('removeTutor', this.model.id);
            }

        });

    }
);