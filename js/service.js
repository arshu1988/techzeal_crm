bwni.service('bwniService', ['$http', '$q', '$rootScope','$timeout','$state', function ($http, $q, $rootScope,$timeout,$state) {
	
	
    
    function baseurl(){
		// Staging
		return document.getElementsByTagName("base")[0].href+'bknd/';
		
		// Local
		//return 'http://localhost:100/api/';
	}
	
	function baseurlNode(){
		
		// Staging
	//	return 'http://135.53.30.13:3000/';
		
		// Local
	//	return 'http://localhost:3000/';
	return document.getElementsByTagName("base")[0].href+'bknd/';
		
	}

	$rootScope.base_url_bacend_tz = baseurl();

	

	var get_vaisc_info = function()
	{
		let localStorageData = localStorage.getItem("website_info");

		if(localStorageData)
		{
		//	return localStorageData;
		localStorageData = angular.fromJson(localStorageData);
		$rootScope.page = localStorageData;
		}
		else
		{
			let apiUrl = 'welcome/get_basic_info';
			var serviceData = $q.defer(); 
				$http({method: 'GET',
					url: baseurl()+apiUrl,
					}).then(function (data, status, headers, config) {
					serviceData.resolve(data.data);
					localStorage.setItem('website_info',JSON.stringify(data.data.data));
					//$rootScope.page = data.data.data;
					localStorageData = localStorage.getItem("website_info");
					localStorageData = angular.fromJson(localStorageData);
					$rootScope.page = localStorageData;
					},function(error){
					bootbox.alert("<img src='assets/custom/images/icon-error.svg'/><p class=''>Please try again.</p>");
				});
			serviceData.promise;
			
		}
	}

	get_vaisc_info();

	return {
        getData: function (apiUrl) { //function for call webservice
			if(apiUrl){
				var serviceData = $q.defer(); 
				$http({method: 'GET',
					url: apiUrl,
					}).then(function (data, status, headers, config) {
					serviceData.resolve(data.data);
					},function(error){
					bootbox.alert("<img src='assets/custom/images/icon-error.svg'/><p class=''>Please try again.</p>");
				});
				return serviceData.promise;
			}
		},
		get_base_url : function () {
			return baseurl();
		},
        postData: function (apiUrl,postData) { //function for call webservice
			
			let form = new FormData();
			for(let pd in postData)
			{
				form.append(pd,postData[pd]);
			}
			var serviceData = $q.defer(); 
			$http({method: 'POST',
				data: form,
				url: baseurl()+apiUrl,
				headers:{
					'Content-Type': undefined
				}
				}).then(function (data, status, headers, config) {
                serviceData.resolve(data.data);
				},function(error){
					swal ( "Error" ,  "Unable to Process the request !!!!!\n"+error ,  "error" );
			});
			return serviceData.promise;
		},
		postDataNode: function (apiUrl,postData, typeHeader = '') { //function for call webservice
			var serviceData = $q.defer(); 
			/* $http({method: 'POST ',
				data: postData,
				url: baseurlNode()+apiUrl,
				headers:{
                'Content-Type': 'application/json'
				}
				}).then(function (data, status, headers, config) {
                serviceData.resolve(data.data);
				},function(error){
				bootbox.alert("<img src='assets/custom/images/icon-error.svg'/><p class=''>Please try again.</p>");
				});
			return serviceData.promise;*/
			//console.log(baseurlNode()+apiUrl);
			//debugger;
			let form = new FormData();
			for(let pd in postData)
			{
				form.append(pd,postData[pd]);
			}
			if(typeHeader == 'multipart'){
				
				var postReq = $http({
					method: 'POST',
					data: form,
					url: baseurlNode()+apiUrl,
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				});
				}else{
				var postReq = $http({
					method: 'POST',
					data: form,
					url: baseurlNode()+apiUrl,
					headers:{
						'Content-Type': 'application/json'
					}
				})
			}
			postReq.then(function successCallback(response) {
				serviceData.resolve(response.data);
				}, function errorCallback(response) {
				serviceData.resolve(response);
				bootbox.alert("<img src='assets/custom/images/icon-error.svg'/><p class=''>Please try again.</p>");
			});
			return serviceData.promise;
		},
        presentToast: function(type='success', title = '',message,callback_func = null){
			
			if(["warning","error","success","info"].indexOf(type)<0)
			{
				type = 'info';
			}
			swal({
				title: title,
				text: message,
				type: type
			}).then(function() {
				if(callback_func)
				{
					$state.go(callback_func);
				}
				
			});
			//Old code of pramod Sir
			/*if(title != '' && status != ''){
				if(status == 'success'){
					swal({
						title: title, 
						text: message, 
						icon: status
					});
					}else{
					swal({
						title: title, 
						text: message, 
						type: status
					});
				}      
				}else if(status != ''){
				if(status == 'error'){
					swal({
						title: 'Oops!', 
						text: message, 
						icon: status
					});
					}else{
					swal({
						text: message, 
						icon: status
					});
				}   
			}
			else{
				swal({
					text: message
				});
			}*/
		},
        checkSession: function () {   // if not logged in redirect to index page
			var localStorageData = localStorage.getItem("userDataInfo");
			if(localStorageData){
				try {
					localStorageData = angular.fromJson(localStorageData);
					return localStorageData;
					} catch (error) {
					console.log(error)
				}
			}
		},
		set_session: function(user_data){ //set user Session
			localStorage.setItem("userDataInfo",JSON.stringify(user_data));
		},
        baseurlSecure : function () {
			return 'https://firebasestorage.googleapis.com/v0/b/qliniqo-admin.appspot.com/o/otboo_svg-qr.png?alt=media&token=803de33d-aa76-4e12-81a4-0e9bf528d4cb'
		},
        alert :function(msg){
			bootbox.alert("<img src='assets/custom/images/icon-alert.svg'/><p class=''>"+ msg+"</p>");
		},
		
        confirm :function(msg,callback){
			bootbox.confirm({
				message: "<img src='assets/custom/images/icon-alert.svg'/><p>"+msg+"</p>",
				buttons: {
					confirm: {
						label: 'Yes',
						className: 'btn-success'
					},
					cancel: {
						label: 'No',
						className: 'btn-danger'
					}
				},
				callback: callback
			});
            
		}
        
	}     
}]);
