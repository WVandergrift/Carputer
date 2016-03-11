/**
 * @ngdoc service
 * @name App.factory:VideoDevice
 *
 * @description
 * API factory for Video Device
 *
 */
App.factory('Artist', ['$q','$rootScope', '$filter', 'PROPS', 'API_PARAMETERS', 'Album',
    function ($q, $rootScope, $filter, PROPS, API_PARAMETERS, Album) {
        var Artist = function (artistData) {
            angular.extend(this, {

                albums: [],

                /**
                 * @ngdoc object
                 * @name method:initArtist
                 * @methodOf App.factory:Artist
                 *
                 * @description
                 * Formats the retrieved artist data to extend it and make it easier to work with
                 *
                 * @return {Object} A well formed artist object
                 */
                initArtist: function() {
                    this.getAlbums();
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

                getAlbums: function() {
                    var albums = this.albums;
                    angular.forEach(this.album, function(albumData, key){
                        albums.push(new Album(albumData));
                    });
                },

                /**
                 * @ngdoc object
                 * @name method:extendMe
                 * @methodOf App.factory:Artist
                 *
                 * @description
                 * Extend the artist object with the sent data
                 */
                extendMe: function (artistData) {
                    angular.extend(this, artistData);
                }
            });

            // Initialize the video device with existing data
            if (artistData !== null && angular.isDefined(artistData)) {
                this.extendMe(artistData);
                this.initArtist();
            }
        };

        return Artist;
    }]);
