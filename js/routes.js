angular
.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

  $urlRouterProvider.otherwise('/login');

  $ocLazyLoadProvider.config({
    // Set to true if you want to see what and when is dynamically loaded
    debug: false
  });

  $breadcrumbProvider.setOptions({
    prefixStateName: 'app.main',
    includeAbstract: true,
    template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
  });

  $stateProvider
  .state('app', {
    abstract: true,
    templateUrl: 'views/common/layouts/full.html',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Root',
      skip: true
    },
    resolve: {
      loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load CSS files
        return $ocLazyLoad.load([{
          serie: true,
          name: 'Flags',
          files: ['node_modules/flag-icon-css/css/flag-icon.min.css']
        },{
          serie: true,
          name: 'Font Awesome',
          files: ['node_modules/font-awesome/css/font-awesome.min.css']
        },{
          serie: true,
          name: 'Simple Line Icons',
          files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
        }]);
      }],
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load([{
          serie: true,
          name: 'chart.js',
          files: [
            'node_modules/chart.js/dist/Chart.min.js',
            'node_modules/angular-chart.js/dist/angular-chart.min.js'
          ]
        }]);
      }],
    }
  })
  .state('app.main', {
    url: '/dashboard',
    data: {
      requiresAuthentication: true
    },
    templateUrl: 'views/home.html',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Home',
    },
    //page subtitle goes here
    params: { subtitle: 'Welcome to ROOT powerfull Bootstrap & AngularJS UI Kit' },
    resolve: {
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load([
          {
            serie: true,
            name: 'chart.js',
            files: [
              'node_modules/chart.js/dist/Chart.min.js',
              'node_modules/angular-chart.js/dist/angular-chart.min.js'
            ]
          },
        ]);
      }],
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/main.js']
        });
      }],
      
    }
  })
  .state('appSimple', {
    abstract: true,
    templateUrl: 'views/common/layouts/simple.html',
    resolve: {
      loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load CSS files
        return $ocLazyLoad.load([{
          serie: true,
          name: 'Font Awesome',
          files: ['node_modules/font-awesome/css/font-awesome.min.css']
        },{
          serie: true,
          name: 'Simple Line Icons',
          files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
        }]);
      }],
    }
  })
//Accounting Pages
.state('app.accounting', {
  url: "/accounting",
  abstract: true,
  template: '<ui-view></ui-view>',
  ncyBreadcrumb: {
    label: 'Accounting'
  }
})
.state('app.accounting.customers', {
  url: '/customers',
  templateUrl: 'views/accounting/customers.html',
  ncyBreadcrumb: {
    label: 'Customers'
  },
  resolve: {
    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
      // you can lazy load controllers
      return $ocLazyLoad.load({
        files: ['js/controllers/tz/customer_controller.js','vendors/js/dirPagination.js']
      });
    }],
    
  }
})
.state('app.accounting.add_new_customer', {
  url: '/customers/add_new',
  templateUrl: 'views/accounting/add_new_customer.html',
  ncyBreadcrumb: {
    label: 'Add New Customer'
  },
  resolve: {
    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
      // you can lazy load controllers
      return $ocLazyLoad.load({
        files: ['js/controllers/tz/customer_controller.js']
      });
    }],
    
  }
})
.state('app.accounting.purchase_orders', {
  url: '/purchase_orders/list',
  templateUrl: 'views/accounting/po_list.html',
  ncyBreadcrumb: {
    label: 'List Generated PO'
  },
  resolve: {
    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
      // you can lazy load controllers
      return $ocLazyLoad.load({
        files: ['js/controllers/tz/customer_controller.js','vendors/js/dirPagination.js']
      });
    }],
    
  }
})
.state('app.accounting.add_new_po', {
  url: '/purchase_orders/add_new?/:cust_id',
  templateUrl: 'views/accounting/add_new_po.html',
  ncyBreadcrumb: {
    label: 'Add New Purchase Order'
  },
  resolve: {
    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
      // you can lazy load controllers
      return $ocLazyLoad.load({
        files: ['js/controllers/tz/customer_controller.js']
      });
    }],
    
  }
})
.state('app.accounting.add_new_invoice', {
  url: '/invoices/add_new_invoice?/:cust_id',
  templateUrl: 'views/accounting/add_new_invoice.html',
  ncyBreadcrumb: {
    label: 'Add New Invoice'
  },
  resolve: {
    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
      // you can lazy load controllers
      return $ocLazyLoad.load({
        files: ['js/controllers/tz/customer_controller.js']
      });
    }],
    
  }
})
  // Additional Pages
  .state('appSimple.login', {
    url: '/login',
    templateUrl: 'views/pages/login.html',
    controller:'loginCtrl'
  })
  .state('appSimple.register', {
    url: '/register',
    templateUrl: 'views/pages/register.html'
  })
  .state('appSimple.404', {
    url: '/404',
    templateUrl: 'views/pages/404.html'
  })
  .state('appSimple.500', {
    url: '/500',
    templateUrl: 'views/pages/500.html'
  })
}]);
