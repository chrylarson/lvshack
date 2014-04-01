'use strict';

describe('Controller: ShackCtrl', function () {

  // load the controller's module
  beforeEach(module('lvshackApp'));

  var ShackCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShackCtrl = $controller('ShackCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
