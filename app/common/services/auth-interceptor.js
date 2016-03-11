App.factory('AuthInterceptor', function ($window, $q, PROPS, API_PARAMETERS) {
    return {
        request: function(config) {

            if (config.url.indexOf(PROPS.apiUrl) >=0) {
                config.params = config.params || {};
                config.params.u = API_PARAMETERS.user;
                config.params.p = API_PARAMETERS.password;
                config.params.c = API_PARAMETERS.client;
                config.params.v = API_PARAMETERS.version;
                config.params.f = API_PARAMETERS.format;
            }


            return config || $q.when(config);
        },

        requestError: function(error) {
            console.log('Intercepting Requests');
            return $q.reject(error);
        },

        responseError: function(error) {
            if (error.status === 401) {
                // TODO: Redirect user to login page.
                console.log("http 401: does user need to login?");
            }
            return $q.reject(error);
        }
    };
});

// Register the previously created AuthInterceptor.
App.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});