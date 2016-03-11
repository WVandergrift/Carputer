/**
 * @ngdoc service
 * @name App.factory:VideoDevice
 *
 * @description
 * API factory for Video Device
 *
 */
App.factory('Album', ['$q','$rootScope', '$filter', 'PROPS', 'API_PARAMETERS', 'Song',
    function ($q, $rootScope, $filter, PROPS, API_PARAMETERS, Song) {
        var Album = function (albumData) {
            angular.extend(this, {

                songs: [],

                /**
                 * @ngdoc object
                 * @name method:initAlbum
                 * @methodOf App.factory:Album
                 *
                 * @description
                 * Formats the retrieved album data to extend it and make it easier to work with
                 *
                 * @return {Object} A well formed album object
                 */
                initAlbum: function() {
                    this.getSongs();
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


                getSongs: function() {
                    var songs = this.songs;
                    angular.forEach(this.song, function(songData, key){
                        songs.push(new Song(songData));
                    });
                },

                /**
                 * @ngdoc object
                 * @name method:extendMe
                 * @methodOf App.factory:Album
                 *
                 * @description
                 * Extend the album object with the sent data
                 */
                extendMe: function (albumData) {
                    angular.extend(this, albumData);
                }
            });

            // Initialize the video device with existing data
            if (albumData !== null && angular.isDefined(albumData)) {
                this.extendMe(albumData);
                this.initAlbum();
            }
        };

        return Album;
    }]);
