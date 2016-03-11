/**
 * @ngdoc service
 * @name App.factory:MediaPlayerService
 *
 * @description
 * API Interface service for playing media files and managing playlists
 *
 */
App.factory('MediaPlayerService', ['$rootScope', '$q', '$interval', 'PROPS', '$filter', 'Song', 'AudioService', 'TextToSpeechService', 'MusicLibraryService',
    function ($rootScope, $q, $interval, PROPS, $filter, Song, AudioService, TextToSpeechService, MusicLibraryService) {

        var mediaPlayer = {
            audio: AudioService, // The Audio5 object used for playing audio
            nowPlaying: undefined, // The current song that's playing
            playlist: [], // An array of song elements that are queued up for playing
            playlistIndex: undefined, // The current song index that we're playing from the playlist or undefined
            playlistPlaying: false,
            isPlaying: false,
            looping: false,
            progress: 0,
            lastProg: 0, // This is used to compare our current playing progress to the previous update play progress

            togglePlayPause: function() {
                if (angular.isDefined(mediaPlayer.audio)) {
                    this.isPlaying ? this.pause() : this.play();
                }
            },

/*            /!**
             * @ngdoc object
             * @name method:updateStatus
             * @methodOf App.factory:MediaPlayerService
             *
             * @description
             * Get the current status of the media player
             *!/
            updateStatus: function() {
                if (!angular.isDefined(mediaPlayer.audio)) { console.log("Audio Player not initialized"); return; }

                // Update our playing status
                (mediaPlayer.audio.progress > mediaPlayer.lastProg) ? mediaPlayer.isPlaying = true : mediaPlayer.isPlaying = false;


                console.log("Track progress: " + mediaPlayer.audio.progress + " IsPlaying: " + mediaPlayer.isPlaying);
                // Check the progress of the current track
                if (mediaPlayer.audio.progress == 1) {
                    // We're finished playing the current track, check to see if we need to play another
                    if (mediaPlayer.isPlaying && mediaPlayer.playlistPlaying) {
                        // Play the next track if we're not at the end of the list
                        mediaPlayer.playNextPlaylist();
                    }
                }

                mediaPlayer.lastProg = mediaPlayer.audio.progress;
            },*/

            /**
             * @ngdoc object
             * @name method:playSong
             * @methodOf App.factory:MediaPlayerService
             *
             * @description
             * Plays the specified song
             */
            playSong: function(song) {
                console.log("Preparing to load " + song.title);
                this.nowPlaying = angular.copy(song);
                this.playlistPlaying = false;
                this.stop();
                this.audio.load(song.url);
                this.audio.play();
            },

            playNextPlaylist: function() {
                // If we're not at the end of the playlist, play the next track, else stop the playlist
                if (this.playlistIndex + 1 < this.playlist.length) {
                    this.playFromPlaylist(this.playlistIndex + 1);
                } else {
                    // We're finished with the playlist
                    console.log("Playlist complete");
                    this.playlistIndex = undefined;
                    this.playlistPlaying = false;
                }
            },

            playPreviousPlaylist: function() {
                // If we're not at the end of the playlist, play the next track, else stop the playlist
                if (this.playlistIndex - 1 < this.playlist.length) {
                    this.playFromPlaylist(this.playlistIndex - 1);
                } else {
                    // We're finished with the playlist
                    console.log("Playlist complete");
                    this.playlistIndex = undefined;
                    this.playlistPlaying = false;
                }
            },

            play: function() {
                if (angular.isDefined(this.audio)) {
                    this.audio.play();
                }
            },

            pause: function() {
                if (angular.isDefined(this.audio)) {
                    this.audio.pause();
                }
            },

            playFromPlaylist: function(songIndex) {
                var deferred = $q.defer();
                var _this = this;

                if (songIndex >= this.playlist.length) {
                    console.log("The specified song index (" + songIndex + ") is out of bounds. Max index is currently " + this.playlist.length - 1);
                    return
                }

                _this.pause();
                this.nowPlaying = angular.copy(this.playlist[songIndex]);
                this.announceSong(this.nowPlaying).then(function(){
                    console.log("Getting ready to play song at index " + songIndex + "(" + _this.nowPlaying.title + ")");

                    _this.playlistPlaying = true;
                    _this.playlistIndex = songIndex; // Update our current playlist index

                    _this.audio.load(_this.nowPlaying.url);
                    _this.audio.play();
                    $rootScope.$broadcast('trackChanged', _this.nowPlaying);
                    deferred.resolve(_this.nowPlaying);
                });

                return deferred.promise;
            },

            /**
             * @ngdoc object
             * @name method:startRadio
             * @methodOf App.factory:MusicLibraryService
             *
             * @description
             * Takes the currently playing song and the list of supplied songs and creates a new playlist
             */
            startRadio: function(songs) {
                var id = parseInt(mediaPlayer.nowPlaying.artistId, 10);
                MusicLibraryService.getSimilarSongs(id, 25).then(function(songs){
                    mediaPlayer.playlist = [];
                    mediaPlayer.playlist.push(mediaPlayer.nowPlaying); // Add our currently playing song to the playlist
                    mediaPlayer.playlist = mediaPlayer.playlist.concat(songs); // Add the rest of the songs to the playlist

                    mediaPlayer.playlistPlaying = true;
                    mediaPlayer.playlistIndex = 0; // Update our current playlist index
                });
            },

            announceSong: function(song) {
                var deferred = $q.defer();

                TextToSpeechService.sayPhrase(song.title + " by " + song.artist).then(function(){
                   deferred.resolve();
                });

                return deferred.promise;
            },

            initialize: function() {
                //this points to the Audio5js instance
                mediaPlayer.audio.on('play', function () {
                    console.log('track playing');
                    mediaPlayer.isPlaying = true;
                    $rootScope.$apply();
                }, mediaPlayer.audio);

                mediaPlayer.audio.on('pause', function () {
                    console.log('track paused');
                    mediaPlayer.isPlaying = false;
                    $rootScope.$apply();
                }, mediaPlayer.audio);

                mediaPlayer.audio.on('ended', function () {
                    console.log('track ended');
                    mediaPlayer.isPlaying = false;
                    $rootScope.$apply();
                }, mediaPlayer.audio);

                mediaPlayer.audio.on('timeupdate', function (position, duration) {
                    console.log("Current track progress: " + mediaPlayer.progress);
                    mediaPlayer.progress = (position / duration) * 100;
                    $rootScope.$apply();
                }, mediaPlayer.audio);

            }
        };

        //var update = $interval(mediaPlayer.updateStatus, 100);
        mediaPlayer.initialize();
        return mediaPlayer;

    }]);