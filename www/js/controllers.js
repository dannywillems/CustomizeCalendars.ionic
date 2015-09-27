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
    'SettingsController',
    function($scope)
    {
        $scope.text     = cc_text_settings;
    }
)

.controller
(
    'CalendarController',
    function($scope, ccCalendarServices, $ionicPopup, $ionicHistory, $stateParams, $cordovaBarcodeScanner, $cordovaFile, $cordovaFileTransfer, $timeout, $state)
    {
        //console.log("Received id: " + $stateParams.id);

        /* ------------------ */
        /* Text instanciation */
        $scope.calendarItemExplanation = cc_text_calendar_item_explanation;
        $scope.calendarItemExample = cc_text_calendar_item_example;
        $scope.calendarItem = cc_text_calendar_item;

        $scope.agendaItem = cc_text_agenda_item;
        $scope.availableAgenda = ccCalendarServices.getAllCalendars();
        $scope.agendaItemExplanation = cc_text_agenda_item_explanation;

        $scope.synchronisationItem = cc_text_synchronisation_item;
        $scope.synchronisationValue = cc_text_synchronisation_value;

        $scope.urlItem = cc_text_url_item;
        $scope.urlItemScan = cc_text_url_item_scan;
        $scope.urlItemExample = cc_text_url_item_example;
        $scope.urlItemScanText = cc_text_url_item_scan_text;

        $scope.scanBarcode =
            function()
            {
                $cordovaBarcodeScanner.scan().then
                (
                    function(result)
                    {
                        $("#url").val(result.text);
                    },
                    function(error)
                    {
                        /* TODO: To change to be more explicit */
                        alert(cc_text_scan_failed + " : " + error);
                    }
                );
            };

        $scope.editEvents = cc_text_edit_events;

        $scope.goBack =
            function()
            {
                $ionicHistory.goBack();
            };

        /* ------------------ */
        //console.log($stateParams.id);
        if ($stateParams.id == -1)
        {
            //console.log("No id sent. Show default page");

            /* --------------- */
            /* Text instanciation */
            $scope.addCalendarTitle = cc_text_add_calendar;
            $scope.calendarName = "";
            $scope.url = "";
            //$("#url").val("");
            //$("#calendarName").val("");
            /* --------------- */

            $scope.save =
                function()
                {
                    console.log("Save asked");
                    /*
                    var url = $("#url").val();
                    var calendarName = $("#calendarName").val();
                    if (url != "" && calendarName != "")
                    {
                        $cordovaFileTransfer.download(encodeURI(url), cordova.file.dataDirectory + calendarName, {}, true).then
                        (
                            function(result)
                            {
                                $cordovaFile.readAsText(cordova.file.dataDirectory, calendarName).then
                                (
                                    function(success)
                                    {
                                        var listEvents = ccCalendarServices.getAllEvents(success);
                                        ccCalendarServices.updateEvents(localStorage.getItem("nextID"), listEvents);
                                        ccCalendarServices.addCalendar(calendarName, url, "2");
                                        $state.go("menu.home");
                                    },
                                    function(err)
                                    {
                                        alert("erreur lecture fichier");
                                    }
                                );
                            },
                            function(err)
                            {
                                alert("Erreur.\nCode: " + err.code +
                                "\nSource: " + err.source + "\nhttp_status: " +
                                err.http_status);
                            },
                            function(progress)
                            {
                                $timeout
                                (
                                    function()
                                    {
                                        console.log((progress.loaded / progress.total) * 100);
                                    }
                                );
                            }
                        );
                    }
                    else
                    {
                        var myPopup = $ionicPopup.confirm
                        (
                            {
                                title: cc_text_confirm,
                                template: "Veuillez remplir les champs du nom, de l'url et l'agenda",
                                cssClass: "cc-popup-remove",
                                buttons:
                                [
                                    {
                                        type: "cc-button-ok",
                                        text: cc_text_validate,
                                    }
                                ]
                            }
                        );
                    }
                    */
                }
        }
        else
        {
            var calendarSent = ccCalendarServices.getCalendarFromId($stateParams.id);

            console.log("Id found. Calendar data will be loaded");
            console.log(calendarSent);

            $scope.calendarName = calendarSent["name"];
            $scope.selectedAgenda = $scope.availableAgenda[ccCalendarServices.getAgendaIndice(calendarSent, $scope.availableAgenda)];
            $scope.url = calendarSent["url"];
            $scope.getLinkEditEvents =
                function()
                {
                    return ($state.href('menu.events', {calendarID: $stateParams.id}));
                };
        }
    }
)

.controller
(
    'EventsController',
    function($scope, $stateParams, $ionicHistory, ccEventsServices)
    {
        $scope.text_rename = cc_text_rename;
        $scope.text_in = cc_text_in;
        $scope.text_newName = cc_text_newName;
        $scope.text_cancel = cc_text_cancel;
        $scope.text_validate = cc_text_validate;
        $scope.text_register = cc_text_register;

        console.log($stateParams.calendarID);
        if ($stateParams.calendarID >= 0)
            $scope.events = ccEventsServices.getEventsByCalendarID($stateParams.calendarID);
        else
            $scope.events = ccEventsServices.getEventsByCalendarID(1);
        /*
        $scope.cancelClick =
                function()
                {
                    console.log("Go back action from 'menu.events'");
                    $ionicHistory.goBack();
                };
        */
    }
);
