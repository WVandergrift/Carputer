/**
 * @ngdoc service
 * @name App.factory:MusicLibraryService
 *
 * @description
 * API Interface service for Video Devices.
 *
 */
App.factory('MusicLibraryService', ['$rootScope', '$q', 'PROPS', '$filter', 'MusicLibraryAPI', 'Artist', 'Album', 'Song',
    function ($rootScope, $q, PROPS, $filter, MusicLibraryAPI, Artist, Album, Song) {
        return {

            allArtists: [], // is a complete list of artists retrieved from the music library
            allAlbums: [],
            allSongs: [],
            curArtists: [],
            curAlbums: [],
            curSongs: [],

            /**
             * @ngdoc object
             * @name method:getRandomSongs
             * @methodOf App.factory:MusicLibraryService
             *
             * @description
             * Gets a list of random songs from the API.
             *
             * @return {array of songs} if the call was successful, else returns an error
             */
            getRandomSongs: function(count) {
                var deferred = $q.defer();
                var _this = this;

                console.log("In getRandomSongs. Preparing to make API call");

                MusicLibraryAPI.getRandomSongs(
                    {
                        //params
                        count: count
                    },
                    function (data) {   //success
                        var songs = [];
                        angular.forEach(data["subsonic-response"].randomSongs.song, function(songData, key){
                            songs.push(new Song(songData));
                        });
                        console.log("Successfully got " + count + " random songs from the music library API");
                        deferred.resolve(songs);
                    },
                    function (error) {   //failure
                        console.log("Error in MusicLibraryService 'getRandomSongs' API");
                        deferred.reject(error);
                    },
                    function (info) {   //failure
                        deferred.notify(info);
                    });
                return deferred.promise;
            },

            /**
             * @ngdoc object
             * @name method:getSimilarSongs
             * @methodOf App.factory:MusicLibraryService
             *
             * @description
             * Gets a list of similar songs from the API.
             *
             * @return {array of songs} if the call was successful, else returns an error
             */
            getSimilarSongs: function(id, count) {
                var deferred = $q.defer();
                var _this = this;

                console.log("In getRandomSongs. Preparing to make API call");

                MusicLibraryAPI.getSimilarSongs(
                    {
                        //params
                        id: id,
                        count: count
                    },
                    function (data) {   //success
                        var songs = [];
                        angular.forEach(data["subsonic-response"].similarSongs2.song, function(songData, key){
                            songs.push(new Song(songData));
                        });
                        console.log("Successfully got " + count + " similar songs from the music library API");
                        deferred.resolve(songs);
                    },
                    function (error) {   //failure
                        console.log("Error in MusicLibraryService 'getSimilarSongs' API");
                        deferred.reject(error);
                    },
                    function (info) {   //failure
                        deferred.notify(info);
                    });
                return deferred.promise;
            },

            loadLibrary: function() {
                var deferred = $q.defer();
                var _this = this;

                this.getArtists().then(function(artists){
                    _this.library = artists;
                    deferred.resolve();
                }, function(error){
                    deferred.reject(error);
                });

                return deferred.promise;
            },

            /**
             * @ngdoc object
             * @name method:getArtists
             * @methodOf App.factory:MusicLibraryService
             *
             * @description
             * Gets a list of all artists in the music library
             *
             * @return {array of Artists} if the call was successful, else returns an error
             */
            getArtists: function() {
                var deferred = $q.defer();
                var _this = this;
                var artists = [];

                console.log("In getArtists. Preparing to make API call");

                MusicLibraryAPI.getArtists(
                    {},
                    function (data) {   //success
                        var artistResult = data["subsonic-response"].artists;
                        if (artistResult === null || !angular.isDefined(artistResult)) { deferred.reject() }

                        angular.forEach(artistResult.index, function(artistIndex, key){
                            angular.forEach(artistIndex.artist, function(artistData, key){
                                artists.push(new Artist(artistData));
                            });
                        });
                        console.log("Successfully got artists from the music library API");
                        console.log("Updating local artist cache");
                        _this.allArtists = artists;
                        deferred.resolve(artists);
                    },
                    function (error) {   //failure
                        console.log("Error in MusicLibraryService 'getArtists' API");
                        deferred.reject(error);
                    },
                    function (info) {   //failure
                        deferred.notify(info);
                    });
                return deferred.promise;
            },

            /**
             * @ngdoc object
             * @name method:searchArtists
             * @methodOf App.factory:MusicLibraryService
             *
             * @description
             * Gets a list of artists that match the search string
             *
             * @return {array of songs} if the call was successful, else returns an error
             */
            searchArtists: function(searchString, count) {
                var deferred = $q.defer();
                var _this = this;
                var artists = [];

                console.log("In searchArtist. Preparing to make API call");

                MusicLibraryAPI.search3(
                    {
                        //params
                        query: searchString,
                        artistCount: count
                    },
                    function (data) {   //success
                        var artistResult = data["subsonic-response"].searchResult3.artist;
                        if (artistResult === null || !angular.isDefined(artistResult)) { deferred.reject() }

                        angular.forEach(artistResult, function(artistData, key){
                            artists.push(new Artist(artistData));
                        });
                        console.log("Successfully got " + count + " artists from the music library API");
                        deferred.resolve(artists);
                    },
                    function (error) {   //failure
                        console.log("Error in MusicLibraryService 'searchArtists' API");
                        deferred.reject(error);
                    },
                    function (info) {   //failure
                        deferred.notify(info);
                    });
                return deferred.promise;
            },

            /**
             * @ngdoc object
             * @name method:getArtist
             * @methodOf App.factory:MusicLibraryService
             *
             * @description
             * Gets an artist's details including a list of albums
             *
             * @return {Artist} if the call was successful, else returns an error
             */
            getArtist: function(id) {
                var deferred = $q.defer();
                var _this = this;

                console.log("In getArtist. Preparing to make API call");

                MusicLibraryAPI.getArtist(
                    {
                        //params
                        id: id
                    },
                    function (data) {   //success
                        var artist = new Artist(data["subsonic-response"].artist);
                        console.log("Successfully got artist details from the music library API");
                        deferred.resolve(artist);
                    },
                    function (error) {   //failure
                        console.log("Error in MusicLibraryService 'getArtist' API");
                        deferred.reject(error);
                    },
                    function (info) {   //failure
                        deferred.notify(info);
                    });
                return deferred.promise;
            },

            /**
             * @ngdoc object
             * @name method:getAlbum
             * @methodOf App.factory:MusicLibraryService
             *
             * @description
             * Gets an album's details including a list of songs
             *
             * @return {Album} if the call was successful, else returns an error
             */
            getAlbum: function(id) {
                var deferred = $q.defer();
                var _this = this;

                console.log("In getAlbum. Preparing to make API call");

                MusicLibraryAPI.getAlbum(
                    {
                        //params
                        id: id
                    },
                    function (data) {   //success
                        var album = new Album(data["subsonic-response"].album);
                        console.log("Successfully got album details from the music library API");
                        deferred.resolve(album);
                    },
                    function (error) {   //failure
                        console.log("Error in MusicLibraryService 'getAlbum' API");
                        deferred.reject(error);
                    },
                    function (info) {   //failure
                        deferred.notify(info);
                    });
                return deferred.promise;
            },

            /**
             * @ngdoc object
             * @name method:getArtistSongs
             * @methodOf App.factory:MusicLibraryService
             *
             * @description
             * Gets a list of songs for the specified artist
             *
             * @return {Array of songs} if the call was successful, else returns an error
             */
            getArtistSongs: function(artistId) {
                var deferred = $q.defer();
                var _this = this;
                var songs = [];
                var albumPromises = [];

                console.log("In getArtistSongs. Preparing to make API call");

                this.getArtist(artistId).then(function(artist){
                    console.log("Got details for artist: " + artist.name);

                    // Loop through all of the artist albums and get album details
                    angular.forEach(artist.albums, function(album, index) {
                        albumPromises.push(_this.getAlbum(album.id));
                    });

                   $q.all(albumPromises).then(function(albums){
                       angular.forEach(albums, function(album, key){
                           console.log("Got details for album: " + album.name);
                           // Add the album songs to the songs array
                           songs = songs.concat(album.songs);
                       });

                       deferred.resolve(songs); // Return the list of artist songs

                    }, function(error){
                        console.log("An error occurred while getting the album " + album.name);
                        deferred.reject(error);
                    });
                }, function(error){
                    console.log("An error occurred while getting artist details.");
                    deferred.reject(error);
                });

                return deferred.promise;
            },


            /**
             * @ngdoc object
             * @name method:displayDetailedError
             * @methodOf App.Controller:VideoDeviceService
             *
             * @description
             * Display the detailed error message from an error passed back from the API
             */
            displayDetailedError: function (error) {
                console.log("In getDetailedError");
                var handled = false;

                if (error.hasOwnProperty("data")){
                    if (error.data.hasOwnProperty("errors")){
                        angular.forEach(error.data.errors, function(error, key){
                            var concept = key;
                            angular.forEach(error, function(details, key){
                                $rootScope.alerts.push({"type": "error", "text": concept + ": " + details});
                                handled = true;
                            });
                        });
                    } else if (error.data.hasOwnProperty("notice")){
                        $rootScope.alerts.push({"type": "error", "text": error.data.notice.message });
                        handled = true;
                    } else {
                        $rootScope.alerts.push({"type": "error", "text": error.data });
                    }
                }

                // We couldn't display a detailed error, show a more generic error
                if (!handled) {
                    var msg = error.statusText;
                    // Prettify some generic errors
                    if (error.status == 409) { msg = error.status +  ": Video device offline." }
                    $rootScope.alerts.push({"type": "error", "text": msg})
                }
                console.log("getDetailedError completed");
            }

        }
    }]);

/**
 * @ngdoc service
 * @name App.factory:VideoDevicesV2API
 *
 * @description
 * API factory for Video Devices
 *
 */
App.factory('MusicLibraryAPI', ['$resource', 'PROPS', function ($resource, PROPS) {
    return $resource(PROPS.apiUrl + '/rest/:method', {}, {
        get: {method: 'GET', params: {
            video_device_id: '@video_device_id'}},
        // Get a list of random songs from the music library
        getRandomSongs: {method: 'GET', params: {
            method: 'getRandomSongs.view',
            size: '@size',
            genre: '@genre',
            fromYear: '@fromYear',
            toYear: '@toYear',
            musicFolderId: '@musicFolderId' }},
        // Get artist info based on ID3 tags
        getArtistInfo2: {method: 'GET', params: {
            method: 'getArtistInfo2.view',
            id: '@id',
            count: '@count',
            includeNotPresent: '@includeNotPresent'}},
        // Get a list of all artists in the specified folder or entire library
        getArtists: {method: 'GET', params: {
            method: 'getArtists.view',
            musicFolderId: '@musicFolderId'}},
        // Get artist info, including an album list, by id
        getArtist: {method: 'GET', params: {
            method: 'getArtist.view',
            id: '@id'}},
        // Get song info, including a song list, by id
        getAlbum: {method: 'GET', params: {
            method: 'getAlbum.view',
            id: '@id'}},
        // Stream the specified song
        stream: {method: 'GET', params: {
            method: 'stream.view',
            id: '@id',
            maxBitRate: '@maxBitRate',
            format: '@format',
            timeOffset: '@timeOffset',
            size: '@size',
            estimateContentLength: '@estimateContentLength'}},
        // Get artist info based on ID3 tags
        getCoverArt: {method: 'GET', params: {
            method: 'getCoverArt.view',
            id: '@id',
            size: '@size'}},
        // Gets similar songs
        getSimilarSongs: {method: 'GET', params: {
            method: 'getSimilarSongs2.view',
            id: '@artistId',
            count: '@count'}},
        // Searches for a specified artist, album, or song
        search3: {method: 'GET', params: {
            method: 'search3.view',
            query: '@query',
            artistCount: '@artistCount',
            artistOffset: '@artistOffset',
            albumCount: '@albumCount',
            albumOffset: '@albumOffset',
            songCount: '@songCount',
            songOffset: '@songOffset',
            musicFolderId: '@musicFolderId'
        }}
    });
}]);