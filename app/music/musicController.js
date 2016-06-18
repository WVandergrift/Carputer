angular
    .module('App')
    .controller('musicCtrl', ['$scope', '$rootScope', 'utils', 'MusicLibraryService', '$filter',
        function ($scope,$rootScope,utils, MusicLibraryService, $filter) {

            var infScrollCount = 10;

            $scope.alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0-9'];
            $scope.loading = true;
            $scope.artists = [];
            $scope.viewState = "ArtistsGrid";
            $scope.curArtist = {};
            $scope.songs = [];

            MusicLibraryService.getArtists().then(function(artists){
                console.log("Artists Fetched");
                $scope.loading = false;
                $scope.artists = MusicLibraryService.allArtists;
            }, function(error){
                console.log("Failed to load artists from music library service");
                $scope.loading = false;
            });

            $scope.LoadMoreArtists = function() {
                var start = $scope.artists.length;
                var nextArtists = MusicLibraryService.library.splice(start, infScrollCount);
                $scope.artists = $scope.artists.concat(nextArtists);
            };

            $scope.showArtistSongsByAlbum = function(artist) {
                $scope.curArtist = artist;
                $scope.viewState = "AlbumSongListByArtist";
                MusicLibraryService.getArtistSongs(artist.id).then(function(songs){
                    $scope.songs = songs;
                }, function(error){
                    //TODO: Handle Error
                });
                console.log("Preparing to show songs for " + artist.name);
            };

            $scope.showArtistsGrid = function() {
                $scope.curArtist = {};
                $scope.viewState = "ArtistsGrid";
                console.log("Preparing to show artist grid");
            };

        }
    ]);

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}