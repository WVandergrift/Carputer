/**
 * @ngdoc service
 * @name App.factory:SoundFxService
 *
 * @description
 * API Interface service for Text to Speech
 *
 */
App.factory('SoundFxService', ['$q', '$timeout', 'AudioService',
    function ($q, $timeout, AudioService) {
        return {

            audio: AudioService,

            /**
             * @ngdoc object
             * @name method:playFx
             * @methodOf App.factory:SoundFxService
             *
             * @description
             * Plays the specified FX sound
             */
            playFX: function(sound) {
                var mySound = new buzz.sound(sound);
                mySound.load();
                mySound.play();
            }
        };

    }]);