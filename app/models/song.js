/**
 * @ngdoc service
 * @name App.factory:VideoDevice
 *
 * @description
 * API factory for Video Device
 *
 */
App.factory('Song', ['$q','$rootScope', '$filter', 'PROPS', 'API_PARAMETERS',
    function ($q, $rootScope, $filter, PROPS, API_PARAMETERS) {
        var Song = function (songData) {
            angular.extend(this, {

                /**
                 * @ngdoc object
                 * @name method:initSong
                 * @methodOf App.factory:Song
                 *
                 * @description
                 * Formats the retrieved song data to extend it and make it easier to work with
                 *
                 * @return {Object} A well formed song object
                 */
                initSong: function() {
                    this.url = this.buildUrl("stream.view", this.id);
                    this.coverArt = this.buildUrl("getCoverArt.view", this.id);
                },

                buildUrl: function(method, id) {
                    return PROPS.apiUrl + "/rest/" + method +
                        "?id=" + id +
                        "&u=" + API_PARAMETERS.user +
                        "&p=" + API_PARAMETERS.password +
                        "&c=" + API_PARAMETERS.client +
                        "&v=" + API_PARAMETERS.version +
                        "&f=" + API_PARAMETERS.format;
                },

                /**
                 * @ngdoc object
                 * @name method:extendMe
                 * @methodOf App.factory:Song
                 *
                 * @description
                 * Extend the song object with the sent data
                 */
                extendMe: function (songData) {
                    angular.extend(this, songData);
                }
            });

            // Initialize the video device with existing data
            if (songData !== null && angular.isDefined(songData)) {
                this.extendMe(songData);
                this.initSong();
            }
        };

        return Song;
    }]);

