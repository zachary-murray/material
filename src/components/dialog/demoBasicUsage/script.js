angular.module('dialogDemo1', ['ngMaterial'])
.controller('AppCtrl', function($scope, $mdDialog) {
  $scope.showParent = function() {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'dialog1.tmpl.html',
      parent: 'body',
      clickOutsideToClose: true
    });
  };
  $scope.showNonParent = function() {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'dialog1.tmpl.html',
      clickOutsideToClose: true
    });
  };
});

function DialogController($scope, $mdDialog, $mdBottomSheet) {
  $scope.showListBottomSheet = function() {
    $mdBottomSheet.show({
      template: '<md-bottom-sheet><span>hi</span></md-bottom-sheet>',
      parent: 'md-dialog',
      disableParentScroll: true
    });
  };
}
