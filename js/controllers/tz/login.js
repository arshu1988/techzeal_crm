bwni.controller("loginCtrl", function($scope,$location,$window,bwniService,$state,$rootScope,$timeout,$filter,AUTH_EVENTS, AuthService) {

    
    $scope.chk_login = function()
    {
        let PostData = {
            username:$scope.username,
            password:$scope.password
            }
        bwniService.postData('login/check',PostData)
        .then(function(data){
            if(data.status){
                $scope.notificationData = data.result;
                bwniService.set_session(data.data);
                $state.go("app.main");
              }else{
                bwniService.presentToast(data.message);
              }
          },function(){
            console.log("Error in checking Registration form consumer");
          });

    }


    //Code Custom
    $scope.credentials = {
        username: 'arshu1988',
        password: 'admin'
      };
      $scope.login = function (credentials) {
        AuthService.login(credentials).then(function (user) {
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          $scope.setCurrentUser(user);
          $state.go("app.main");
        }, function () {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
      };
});