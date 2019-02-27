//main.js
angular
.module('app')
.controller('customer_controller', customer_controller);

customer_controller.$inject = ['$scope','$location','$window','bwniService','$state','$rootScope'];
function customer_controller($scope,$location,$window,bwniService,$state,$rootScope) {

    $scope.save_customer = function () {
        bwniService.postData('/admin/add_customer',$scope.customer_data).then(function (data) {
            if(data.status==1)
            {
                bwniService.presentToast('success','Customer Registeration',data.message,'app.accounting.customers');
            }
            else
            {
                bwniService.presentToast('error','Customer Registeration',data.message);
            }
        },
        function(){
          console.log('Error Encountered');  
        }
        );
    }

    $scope.initillize_customer_form = function () {
        $scope.customer_data=null;
        }

    $scope.get_customer_list_view = function () {
       // $scope.initillize_customer_form();
       $scope.customer_data =[];
        bwniService.postData('/admin/get_customer_list',).then(function (data)
        {
            if(data.status==1)  
            {
                $scope.customer_data.list = data.data;
                
            }  
        });
    }
    $scope.get_po_list_view = function() {
        $scope.po_list_data =[];
        bwniService.postData('/admin/get_po_list',).then(function (data)
        {
            if(data.status==1)  
            {
                $scope.po_list_data.list = data.data;
               
            }  
        });
    }

    $scope.initillize_purchase_order_form = function()
    {
        //Get Customer LIst
     $scope.customer_list =[];
     $scope.po_data =[];
     $scope.cust_id = $state.params.cust_id;
     $scope.po_data.tz_cust_name = $scope.cust_id;
     bwniService.postData('/admin/get_customer_list',).then(function (data)
        {
            if(data.status==1)  
            {
                $scope.customer_list = data.data;
            }  
        }); 
    }

    $scope.save_purchase_order = function () {
        //var fd = new FormData();
        //fd.append('file', $scope.po_data.tz_po_file[0]);
        $scope.po_data.tz_po_file = $scope.po_data.tz_po_file[0];
        $scope.po_data.tz_po_date_ =  moment($scope.po_data.tz_po_date).format("YYYY-MM-DD");
        bwniService.postDataNode('/admin/add_po',$scope.po_data,'multipart').then(function (data) {
            if(data.status==1)
            {
                bwniService.presentToast('success','PO Processing',data.message,'app.accounting.customers');
            }
            else
            {
                bwniService.presentToast('error','PO Processing',data.message);
            }
        },
        function(){
          console.log('Error Encountered');  
        }
        );
    }

    $scope.process_po = function (poid) {
        
        var postdata = {
            'req_type':'expire',
            'po_id':poid
        }
        bwniService.postData('/admin/process_po',postdata).then(function (data) {
            if(data.status==1)
            {
                bwniService.presentToast('success','PO Processing',data.message,'app.accounting.purchase_orders');
            }
            else
            {
                bwniService.presentToast('error','PO Processing',data.message);
            }
        },
        function(){
          console.log('Error Encountered');  
        }
        );
    }

    $scope.initillize_new_invoice_form = function()
    {
       
        var cust_id = $location.search().cust_id;
        $scope.customerinfo=[];
        $scope.customer_po_info=[];
        $scope.past_bill_detals=[];
        $scope.invoice =[];
        $scope.customer_invoice_type_master = [{"val":"Taxed"},{"val":"Zero Tax"},{"val":"Excluding Tax"}];
        // Get Customer Information
        var postdata = {
            'cust_id':cust_id,
            'req_type':'add'
        }
        bwniService.postData('/admin/customer_info',postdata).then(function (data) {
            if(data.status==1)
            {
                let cust_info = data.cust_info;
                if(cust_info.length>0)
                {
                    cust_info= cust_info[0];
                }
                $scope.customerinfo = cust_info;
                $scope.customer_po_info = cust_info.po_list;
                $scope.customer_po_info.unshift({"id":0,"customer_id":"0","po_date":"","po_number":"No PO","po_document":"","status":"active"});
               bwniService.postData('/admin/get_new_invoiceno',null).then(function (data) {
                    if(data.status==1)
                    {
                        $scope.invoice.invoice_no = data.invoice;
                        $scope.invoice.invoice_date = new Date();
                    }
                });
            }
            else
            {
                bwniService.presentToast('error','Customer Information',data.message);
            }
        },
        function(){
          console.log('Error Encountered');  
        }
        );
    }

    //update Po Date on invoice form
    $scope.update_po_date_invoice_form = function()
    {
        console.log($scope.invoice.po_no);
        if($scope.invoice.po_no==0)
        {
            $scope.invoice.po_date = new Date();
        }
        else
        {
            $scope.customer_po_info.forEach(function(el,val){
                if(el.id==$scope.invoice.po_no)
                {
                    $scope.invoice.po_date =  new Date(el.po_date);
                    console.log($scope.invoice.po_date);
                }
            });
        }
    }
}