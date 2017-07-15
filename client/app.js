var app = angular.module("swiftApp",['ui.router','SwiftControllers']);
angular.module('SwiftControllers',[]);
app.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider){

		$urlRouterProvider.otherwise('/');

	}])
.run(function($rootScope, $urlRouter) {

      //var $rootScope = angular.element(document.querySelectorAll("[ui-view]")[0]).injector().get('$rootScope');
      $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeStart to '+toState.to+'- FIRED when the transition begins. toState,toParams : \n',
      	toState, toParams);
      });

      $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
      });

      $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
      });

      $rootScope.$on('$viewContentLoaded',function(event){
        console.log('$viewContentLoaded - fired after dom rendered',event);
      });

      $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
        console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
      });
	})





