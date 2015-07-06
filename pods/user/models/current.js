define(
    [
        'jquery',
        'underscore',
        'backbone',
        'app/config',
        'lib/window',

        'model'
    ],
    function($, _, Backbone, Config, w,
             AbstractModel
    ) {

        var CurrentUserClass = AbstractModel.extend({

            jwt: null,

            urlRoot: function() {
                return Config.constants.serverGateway + '/users/current';
            },

            url: function() {
                return this.urlRoot();
            },

            dashboardUrl: function() {
                return this.urlRoot + "/dashboard";
            },

            logIn: function(username, password) {
                var self = this;
                var data = {
                    "username": username,
                    "password": password
                };
                return $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: Config.constants.serverGateway + "/auth",
                    data: JSON.stringify(data),
                    dataType: 'json'
                }).done(
                    function(result){
                        self.jwt = result.token;
                        if ('localStorage' in w && w['localStorage'] !== null) {
                            localStorage = w['localStorage'];
                            localStorage['mookbsf_jwt'] = self.jwt;
                        }
                        self.fetch();
                    }
                );
            },

            logOut: function() {
                this.jwt = null;
                if ('localStorage' in w && w['localStorage'] !== null) {
                    localStorage = w['localStorage'];
                    localStorage.removeItem('mookbsf_jwt');
                }
                this.clear();
            },

            isLoggedIn: function() {
                return (this.jwt !== null);
            },

            findSession: function() {
                if ('localStorage' in w && w['localStorage'] !== null) {
                    localStorage = w['localStorage'];
                    var storedToken = localStorage.getItem('mookbsf_jwt');
                    if (storedToken === null) {
                        return false;
                    } else {
                        this.jwt = storedToken;
                        return true;
                    }
                } else {
                    return false;
                }
            },

            update: function(data) {

            }

        });

        return new CurrentUserClass;

    }
);
