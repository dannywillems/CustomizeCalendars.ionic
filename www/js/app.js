angular.module("customizecalendars", ['ionic', 'customizecalendars.controllers'])

.run
(
    function($ionicPlatform)
    {
        $ionicPlatform.ready
        (
            function()
            {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard)
                  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                if (window.StatusBar)
                  StatusBar.styleDefault();
            }
        );
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady()
        {
            console.log(cordova.file);
            console.log(FileTransfer);
        }
    }
)

.config
(
    function($stateProvider, $urlRouterProvider)
    {
        $stateProvider

        .state
        (
            'menu',
            {
                abstract: true,
                url: '/menu',
                templateUrl: 'templates/menu.html',
                controller: 'MenuController'
            }
        )

        .state
        (
            'menuPage',
            {
                abstract: true,
                url: '/menuPage',
                templateUrl: 'templates/menu_page.html',
                controller: 'MenuController'
            }
        )

        /* Menu */
        .state
        (
            'menu.home',
            {
                url: '/home',
                views:
                {
                    'mainContent':
                    {
                        templateUrl: "templates/home.html",
                        controller: 'HomeController'
                    }
                }
            }
        )

        .state
        (
            'menu.settings',
            {
                url: '/settings',
                views:
                {
                    'mainContent':
                    {
                        templateUrl: 'templates/settings.html',
                        controller: 'SettingsController'
                    }
                }
            }
        )

        .state
        (
            'menu.about',
            {
                url: '/about',
                views:
                {
                    'mainContent':
                    {
                        templateUrl: 'templates/about.html'
                    }
                }
            }
        )

        .state
        (
            'menuPage.calendar',
            {
                url: '/calendar/:id',
                views:
                {
                    'mainContent':
                    {
                        templateUrl: 'templates/calendar.html',
                        controller: 'CalendarController'
                    }
                }
            }
        )

        .state
        (
            'menuPage.events',
            {
                url: '/events/:calendarID',
                views:
                {
                    'mainContent':
                    {
                        templateUrl: 'templates/events.html',
                        controller: 'EventsController'
                    }
                }
            }
        );

        $urlRouterProvider.otherwise("/menu/home");
    }
);
