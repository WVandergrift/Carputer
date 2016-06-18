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
            }
        };

        srs.init();
        return srs;
    }
]);