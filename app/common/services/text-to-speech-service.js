/**
 * @ngdoc service
 * @name App.factory:TextToSpeechService
 *
 * @description
 * API Interface service for Text to Speech
 *
 */
App.factory('TextToSpeechService', ['$q', '$timeout',
    function ($q, $timeout) {
        return {

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

                var msg = new SpeechSynthesisUtterance(this.prettifyPhrase(phrase));
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
            },

            /**
             * @ngdoc object
             * @name method:prettifyPhrase
             * @methodOf App.factory:TextToSpeechService
             *
             * @description
             * Check for words or symbols that need to be replaced in order to be pronounced correctly
             */
            prettifyPhrase: function (phrase) {
                var result = phrase;

                result = result.replaceAll("feat.", "featuring");
                result = result.replaceAll("op.", "opus");
                result = result.replaceAll("(Bonus)", "");
                result = result.replaceAll("(Bonus Track)", "");

                return result;
            }
        };

    }]);

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};