angular.module('customizecalendars.controllers', ['ionic', 'ngCordova', 'customizecalendars.services'])

.controller
(
    "HomeController",
    function($scope, $ionicPopup)
    {
        $scope.noCalendar = cc_text_no_calendar;
        $scope.calendars = JSON.parse(localStorage.getItem("calendars"));
        $scope.ccPopupRemoveCalendar =
            function(id, name)
            {
                var myPopup = $ionicPopup.confirm(
                {
                    title: cc_text_confirm,
                    template: cc_text_confirm_remove + "'" + name + "' ?",
                    cssClass: "cc-popup-remove",
                    buttons:
                    [
                        {
                            type: "cc-button-cancel",
                            text: cc_text_cancel
                        },
                        {
                            type: "cc-button-ok",
                            text: cc_text_validate,
                            onTap: function(e)
                            {
                                localStorage.setItem
                                (
                                    "calendars",
                                    JSON.stringify
                                    (
                                        $scope.calendars.filter
                                        (
                                            function(element)
                                            {
                                                return (element["id"] != id);
                                            }
                                        )
                                    )
                                );
                            }
                        }
                    ]
                });
            };
        $scope.isEmpty =
            function(o)
            {
                return (angular.equals([], o));
            };

        function updateCalendarList(newValue, oldValue, scope)
        {
            console.log("updateCalendarList");
            console.log("\tUpdate calendar list");
            console.log(newValue);
            $scope.calendars = JSON.parse(newValue);
        };

    $scope.$watch(function(){return (localStorage.getItem("calendars"));}, updateCalendarList);
    }
)

.controller
(
    'MenuController',
    function($scope)
    {
        $scope.home     = cc_text_menu_home;
        $scope.settings = cc_text_menu_settings;
        $scope.about    = cc_text_menu_about;
    }
)

.controller
(
    'MenuPageController',
    function($scope, $ionicHistory)
    {
        $scope.save =
            function()
            {
                console.log("MenuPageController");
                console.log("\tDefault action for save.");
            };

        $scope.goBack =
            function()
            {
                $ionicHistory.goBack();
            }
    }
)

.controller
(
    'SettingsController',
    function($scope)
    {
        $scope.text     = cc_text_settings;
    }
)

.controller
(
    'CalendarController',
    function($scope, $ionicPopup, $ionicHistory, $state, $stateParams, ccEventsServices)
    {
        console.log("CalendarController");
        //console.log("Received id: " + $stateParams.id);

        /* ------------------ */
        /* Text instanciation */
        $scope.calendarItemExplanation  = cc_text_calendar_item_explanation;
        $scope.calendarItemExample      = cc_text_calendar_item_example;
        $scope.calendarItem             = cc_text_calendar_item;

        $scope.agendaItem               = cc_text_agenda_item;
        $scope.availableAgenda          = ccEventsServices.getAllCalendars();
        $scope.agendaItemExplanation    = cc_text_agenda_item_explanation;

        $scope.synchronisationItem      = cc_text_synchronisation_item;
        $scope.synchronisationValue     = cc_text_synchronisation_value;

        $scope.urlItem                  = cc_text_url_item;
        $scope.urlItemScan              = cc_text_url_item_scan;
        $scope.urlItemExample           = cc_text_url_item_example;
        $scope.urlItemScanText          = cc_text_url_item_scan_text;

        $scope.scanBarcode =
            function()
            {
                $scope.url = ccEventsServices.scanQRCode() || "";
            };

        $scope.editEvents               = cc_text_edit_events;
        /* ------------------ */
        //console.log("\t" + $stateParams.id);
        if ($stateParams.id == -1)
        {
            console.log("\tNo id sent. Show default page");

            /* --------------- */
            /* Text instanciation */
            $scope.cc_text_pageTitle    = cc_text_add_calendar;
            $scope.calendarName         = "";
            $scope.url                  = "";
            /* --------------- */

            $scope.$parent.save =
                function()
                {
                    var url = $("#url").val();
                    var calendarName = $("#calendarName").val();
                    if (ccEventsServices.saveNewCalendar(calendarName, url, "2"))
                        /* Show a popup with choice to edit events or go to home page ? */
                        $state.go("menu.home");
                }
        }
        else
        {
            var calendarSent            = ccEventsServices.getCalendarFromId($stateParams.id);

            console.log("Id found. Calendar data will be loaded");
            console.log(calendarSent);

            $scope.cc_text_pageTitle    = cc_text_edit_calendar;
            $scope.calendarName         = calendarSent["name"];
            $scope.selectedAgenda       = $scope.availableAgenda[ccEventsServices.getAgendaIndice(calendarSent, $scope.availableAgenda)];
            $scope.url                  = calendarSent["url"];
            $scope.getLinkEditEvents =
                function()
                {
                    return ($state.href('menuPage.events', {calendarID: $stateParams.id}));
                };
            $scope.$parent.save =
                function()
                {
                    var url = $("#url").val();
                    var calendarName = $("#calendarName").val();
                    ccEventsServices.updateSavedCalendar(calendarSent, calendarName, url, "2");
                    /* Show a popup with choice to edit events or go to home page ? */
                    $state.go("menu.home");
                }
        }
    }
)

.controller
(
    'EventsController',
    function($scope, $state, $stateParams, $ionicHistory, ccEventsServices)
    {
        console.log("EventsController");
        $scope.text_rename = cc_text_rename;
        $scope.text_in = cc_text_in;
        $scope.text_newName = cc_text_newName;

        console.log($stateParams.calendarID);
        $scope.events = ccEventsServices.getEventsByCalendarID($stateParams.calendarID);
        $scope.$parent.save =
            function()
            {
                console.log("\tSave asked");
                console.log($scope.events);
                ccEventsServices.updateEvents($stateParams.calendarID, $scope.events);
                console.log("Saved");
            }
        var calendarJSON = ccEventsServices.getCalendarFromId($stateParams.calendarID);
        $scope.calendarName = calendarJSON["name"];
    }
);
