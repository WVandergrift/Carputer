/**
 * @ngdoc service
 * @name App.factory:SpeechRecognitionService
 *
 * @description
 * API Interface service for Text to Speech
 *
 */
App.factory('SpeechRecognitionService', ['$q', '$rootScope', '$timeout', 'SRS_Commands',
    function ($q, $rootScope, $timeout, SRS_Commands) {
        var srs = {

            commands : {
                'load *command' : function(command){ srs.srCommand(SRS_Commands.load, command) },
                'start *command' : function(command){ srs.srCommand(SRS_Commands.start, command) },
                'play artist *command' : function(command){ srs.srCommand(SRS_Commands.play_artist, command) },
                'play music by *command' : function(command){ srs.srCommand(SRS_Commands.play_artist, command) },
                'play songs by *command' : function(command){ srs.srCommand(SRS_Commands.play_artist, command) },
                'play music from *command' : function(command){ srs.srCommand(SRS_Commands.play_artist, command) },
                'play songs from *command' : function(command){ srs.srCommand(SRS_Commands.play_artist, command) }
            },

            srCommand: function(cmd, params) {
                console.log("Load " + params);
                var speechCmd = {
                    'command': cmd,
                    'parameters': params
                };
                $rootScope.$broadcast('speechRecognized', speechCmd);
            },

            init: function() {
                annyang.debug();
                annyang.addCommands(srs.commands);
            },

            startRecognition: function(){
                annyang.start();
            },

            pauseRecognition: function(){
                annyang.pause();
            },

            stopRecognition: function(){
                annyang.abort();
            },

            /**
             * @ngdoc object
             * @name method:sayPhrase
             * @methodOf App.factory:TextToSpeechService
             *
             * @description
             * Uses the browsers speech synthesizer to speak the specified phrase
             */
            sayPhrase: function(phrase) {
                var deferred = $q.defer();

                var msg = new SpeechSynthesisUtterance(this.prettyifyPhrase(phrase));
                msg.onend = function(event) {
                    console.log("Completed saying the phrase: " + phrase);
                    deferred.resolve();
                };
                msg.onerror = function(event) {
                    console.log("Something went wrong while trying to say the phrase: " + phrase);
                    deferred.reject();
                };

                window.speechSynthesis.speak(msg);
                // Force the resolve if it's taking longer than 5 seconds. The onend event doesn't always like to fire
                $timeout(function() { deferred.resolve() }, 5000);
                return deferred.promise;
            }
        };

        srs.init();
        return srs;
    }
]);