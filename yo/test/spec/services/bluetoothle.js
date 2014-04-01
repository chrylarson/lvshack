'use strict';

describe('Service: Bluetoothle', function () {

  // load the service's module
  beforeEach(module('lvshackApp'));

  // instantiate service
  var Bluetoothle;
  beforeEach(inject(function (_Bluetoothle_) {
    Bluetoothle = _Bluetoothle_;
  }));

  it('should do something', function () {
    expect(!!Bluetoothle).toBe(true);
  });

});
