bwni.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })

  bwni.service('Session', function () {
      
        this.id = null;
        this.userId = null;
        this.userRole = null;
        this.userName = null;
        this.userEmail = null;
        this.usePermissions = null;
        
    this.create = function (user_details) {
        this.id = user_details.id;
        this.userId = user_details.user_id;
        this.userRole = user_details.user_group[0].name;
        this.userName =user_details.username;
        this.userEmail = user_details.email;
        this.usePermissions = user_details.permissions;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
        this.userName = null;
        this.userEmail = null;
        this.usePermissions = null;
    };
  })
  
bwni.factory('AuthService', function ($http,$state,bwniService, Session) {
    var authService = {};
   
    authService.login = function (credentials) {
        return bwniService.postData('login/check',credentials)
        .then(function(data){
            if(data.status){
                Session.create(data.data);
                return data.data;
            }else{
                console.log('Login Failed');
                //bwniService.presentToast(data.message);
                return null;
              }
          });
        
        /*   return $http
        .post(bwniService.get_base_url()+'login/check', credentials)
        .then(function (res) {
          Session.create(res.data.id, res.data.user.id,
                         res.data.user.role);
          return res.data.user;
        });
        */
    };
   
    authService.isAuthenticated = function () {
      return !!Session.userId;
    };
   
    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };
   
    return authService;
  })

 

bwni.controller('ApplicationController', function ($scope,$state,AuthService) {
$scope.currentUser = null;
//$scope.userRoles = USER_ROLES;
/*if(!$scope.currentUser)
{
    let str = window.location.href;
    if(!str.includes('login'))
{
    window.location = "login";
}

}
*/
$scope.isAuthorized = AuthService.isAuthorized;

    $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
    };

})
/*
bwni.factory('AuthResolver', function ($q, $rootScope, $state) {
    return {
      resolve: function () {
        var deferred = $q.defer();
        var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
            console.log(currentUser);
            debugger;
          if (angular.isDefined(currentUser)) {
            if (currentUser) {
              deferred.resolve(currentUser);
            } else {
              deferred.reject();
              $state.go('appSimple.login');
            }
            unwatch();
          }
        });
        return deferred.promise;
      }
    };
  })
  */