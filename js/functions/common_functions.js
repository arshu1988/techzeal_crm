bwni.service('common_functions', ['$http', '$q', '$rootScope','$timeout', function ($http, $q, $rootScope,$timeout) {


    this.get_user_type= function()
    {
        console.log('aaa');
        let localStorageData = localStorage.getItem("userDataInfo");
        if(!localStorageData)
        {
            return false;
        }
    
        try {
            localStorageData = angular.fromJson(localStorageData);
            //return localStorageData;
            console.log(localStorageData);
            return 'admin';
            } catch (error) {
            console.log(error)
            return false;
            }
    }
    

}]);
