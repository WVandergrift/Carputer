App.directive('dynamicBackgroundImage', function () {
  return function (scope, element, attrs) {
    element.css({
      'background-image': 'url(' + attrs.dynamicBackgroundImage + ')',
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      'background-position': 'center center'
    });
  };
});