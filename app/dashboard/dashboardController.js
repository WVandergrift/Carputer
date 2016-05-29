angular
    .module('App')
    .controller('dashboardCtrl', [
        '$rootScope',
        '$scope',
        '$interval',
        '$timeout',
        'variables',
        'MusicLibraryService',
        'MediaPlayerService',
        'TextToSpeechService',
        function ($rootScope,$scope,$interval,$timeout,variables, MusicLibraryService, MediaPlayerService, TextToSpeechService) {

            $scope.MediaPlayerService = MediaPlayerService;
            $scope.loaded = false;

            MusicLibraryService.getRandomSongs(10).then(function(songs){
                console.log("Songs fetched. Preparing to play first song...");
                MediaPlayerService.playlist = songs;
                $scope.loaded = true;
            }, function(error){
                console.log("Failed to load songs from music library service");
            });

            $scope.playSong = function(song) {
                console.log("Getting ready to play some sweet music");
                MediaPlayerService.playSong(song);
            };

            $scope.playFromPlaylist = function(songIndex) {
                console.log("Getting ready to play from playlist");
                MediaPlayerService.playFromPlaylist(songIndex);
            };

            $scope.epc_media_progress = {
                barColor:'#344E65',
                scaleColor: false,
                trackColor: '#fff',
                lineWidth: 5,
                size: 110,
                easing: variables.bez_easing_swiftOut
            };

        // weather
            $scope.weatherToday = {
                city: 'Some City',
                backgroundImg: 'assets/img/gallery/Image17.jpg',
                icon: 'wi-day-sunny-overcast',
                temperature: '14'
            };
            $scope.weatherData = [
                {
                    icon: 'wi-day-sunny-overcast',
                    temperature: '22',
                    description: 'Mostly Sunny',
                    date: moment().add(1,'days').format('DD MMM (dddd)')
                },
                {
                    icon: 'wi-cloudy',
                    temperature: '19',
                    description: 'Partly Cloudy',
                    date: moment().add(2,'days').format('DD MMM (dddd)')
                },
                {
                    icon: 'wi-day-rain',
                    temperature: '16',
                    description: 'Rainy',
                    date: moment().add(3,'days').format('DD MMM (dddd)')
                },
                {
                    icon: 'wi-day-sunny uk-text-warning',
                    temperature: '24',
                    description: 'Sunny',
                    date: moment().add(4,'days').format('DD MMM (dddd)')
                }
            ];

            $scope.sSidebar = {
                site_online: true,
                top_bar: true,
                minify_assets: true
            };

        }
    ]);