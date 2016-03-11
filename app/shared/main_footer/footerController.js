angular
    .module('App')
    .controller('footerCtrl', [
        '$rootScope',
        '$scope',
        '$q',
        '$interval',
        '$timeout',
        'MusicLibraryService',
        'MediaPlayerService',
        'TextToSpeechService',
        'SoundFxService',
        'FX_Sounds',
        'SpeechRecognitionService',
        'SRS_Commands',
        function ($rootScope,$scope, $q, $interval,$timeout, MusicLibraryService, MediaPlayerService, TextToSpeechService, SoundFxService, FX_Sounds, SpeechRecognitionService, SRS_Commands) {

            $scope.MediaPlayerService = MediaPlayerService;
            $scope.speechModal = UIkit.modal("#speechRecModal");

            var playerWasPlaying = "";

            $scope.startSpeechRecognition = function(){
                playerWasPlaying = MediaPlayerService.isPlaying;
                MediaPlayerService.pause();
                SoundFxService.playFX(FX_Sounds.chimeIn);
                $scope.speechModal.options.bgclose = false;
                $scope.speechModal.show();
                SpeechRecognitionService.startRecognition();
            };

            $scope.stopSpeechRecognition = function(){
                SoundFxService.playFX(FX_Sounds.chimeOut);
                SpeechRecognitionService.stopRecognition();
                $scope.speechModal.hide();
                if (playerWasPlaying) { MediaPlayerService.play() }
            };

            $rootScope.$on('speechRecognized', function(event, data) {
                switch (data.command) {
                    case SRS_Commands.load:
                        console.log("Preparing to load music: " + data.parameters );
                        break;
                    case SRS_Commands.start:
                        console.log("Preparing to start " + data.parameters );
                        parseStartCommands(data.parameters);
                        break;
                    case SRS_Commands.play_artist:
                        console.log("Preparing to play artist " + data.parameters );
                        parsePlayArtist(data.parameters);
                        break;
                }
            });

            function parseStartCommands(command) {
                switch (command) {
                    case "radio":
                        $scope.speechModal.hide();
                        SpeechRecognitionService.stopRecognition();
                        TextToSpeechService.sayPhrase("Starting radio station");
                        MediaPlayerService.play();
                        MediaPlayerService.startRadio();
                        break;
                }
            };

            function parsePlayArtist(artistName) {
                $scope.speechModal.hide();
                SpeechRecognitionService.stopRecognition();
                TextToSpeechService.sayPhrase("Searching for music by " + artistName);

                var artist = MusicLibraryService.searchArtists(artistName, 1).then(function(artists){
                    if (!angular.isDefined(artists) || artists.length <= 0) {
                        TextToSpeechService.sayPhrase("No artist was found with the name " + artistName);
                        return;
                    }

                    // Got an artist back from the search, now get the artist's songs
                    var artist = artists[0];
                    var songs = MusicLibraryService.getArtistSongs(artist.id).then(function(songs){
                        if (songs.length <= 0) {
                            TextToSpeechService.sayPhrase("No songs were found for " + artist.name);
                            return;
                        }

                        // All looks good, play that funky music.
                        MediaPlayerService.playlist = songs;
                        MediaPlayerService.playFromPlaylist(0);
                    }, function(error){
                        TextToSpeechService.sayPhrase("Looks like something went wrong getting artist songs. Please try again.");
                    });
                }, function(error){
                    TextToSpeechService.sayPhrase("Oops. Something went wrong getting artist info. Please try again.");
                });
            }

        }
    ])
;