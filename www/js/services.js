angular.module('customizecalendars.services', [])

.factory
(
    'ccEventsServices',
    function($cordovaCalendar, $cordovaFile, $cordovaFileTransfer, $cordovaBarcodeScanner, $timeout, $ionicPopup, $state)
    {
        var _createCalendar =
            /**
             * Create a calendar object with an id, a name, the url where we
             * can download the ical and the agenda where the events must be
             * registered
             */
            function(idCalendar, nameCalendar, urlCalendar, agendaCalendar)
            {
                console.log("\tcreateCalendar");
                return (
                {
                    id: idCalendar,
                    name: nameCalendar,
                    agenda: agendaCalendar,
                    url: urlCalendar
                });
            }

        var _scanQRCode =
            /**
             * Return the data contained in the qr code scanned. It launches
             * the scan and return data.
             */
            function()
            {
                console.log("\tscanQRCode");
                $cordovaBarcodeScanner.scan().then
                (
                    function(result)
                    {
                        localStorage.setItem("tmp_url", result.text);
                    },
                    function(error)
                    {
                        /* TODO: To change to be more explicit */
                        localStorage.setItem("tmp_url", null);
                        alert(cc_text_scan_failed + " : " + error);
                    }
                )
                var url = localStorage.getItem("tmp_url");
                localStorage.removeItem("tmp_url");
                return (url);
            }

        var _downloadIcal =
            /**
             * Download the ical saved at the url 'url' (first parameter).
             */
            function(url, calendarName)
            {
                console.log("\tdownloadICal");
                $cordovaFileTransfer.download(encodeURI(url), cordova.file.dataDirectory + calendarName, {}, true).then
                (
                    function(result)
                    {
                        $cordovaFile.readAsText(cordova.file.dataDirectory, calendarName).then
                        (
                            function(success)
                            {
                                localStorage.setItem("tmp_contentIcal", JSON.stringify(success));
                            },
                            function(err)
                            {
                                alert("Error when reading file");
                            }
                        );
                    },
                    function(err)
                    {
                        alert("Error.\nCode: " + err.code +
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
                )
                $cordovaFile.removeFile(cordova.file.dataDirectory, calendarName);
                console.log(localStorage.getItem("tmp_contentIcal"));
                var contentIcal = JSON.parse(localStorage.getItem("tmp_contentIcal"));
                console.log(contentIcal);
                localStorage.removeItem("tmp_contentIcal");
                return (contentIcal);
            }

        var _getAllCalendars =
            /**
             * Return all calendars saved in local storage
             */
            function()
            {
                console.log("\tgetAllCalendars");
                $cordovaCalendar.listCalendars().then
                    (
                        function(result)
                        {
                            var calendars = [];
                            for(var i = 0;i < result.length;i++)
                            {
                                calendars.push
                                (
                                    {
                                        id: result[i]["id"],
                                        name: result[i]["name"]
                                    }
                                );
                            }
                            /* Find an other way */
                            localStorage.setItem("calendarsAvailable", JSON.stringify(calendars));
                        },
                        function(err)
                        {
                            localStorage.setItem("calendarsAvailable", JSON.stringify(err));
                        }
                    );
                return (JSON.parse(localStorage.getItem("calendarsAvailable")));
            }

        var _getCalendarFromID =
            /**
             * Return the calendar object which has 'idCalendar' as id
             */
            function(idCalendar)
            {
                console.log("\tgetCalendarFromId");
                var calendars = JSON.parse(localStorage.getItem("calendars"));
                //console.log("\tGet all calendars saved");
                //console.log("\t" + calendars.length + " calendars found");
                for(var i = 0;i < calendars.length;i++)
                {
                    //console.log("\tRead " + calendars[i]);
                    if (calendars[i]["id"] == idCalendar)
                    {
                        //console.log("\tCalendar found");
                        return (calendars[i]);
                    }
                }
                //console.log("\tNo calendar found");
                return (null);
            }

        var _getAgendaIndice =
            /**
             * Get the agenda indice of the calendar sent as first parameter
             */
            function(calendar, agendaList)
            {
                for(var i = 0;i < agendaList.length;i++)
                {
                    if (calendar["agenda"] == agendaList[i]["id"])
                        return (i);
                }
                return (-1);
            }


        var _updateCalendar =
            /**
             * Update the calendar saved with idCalendar as id
             */
            function(idCalendar, name, url, agenda)
            {
                console.log("_updateCalendar");
                var calendars = JSON.parse(localStorage.getItem("calendars"));
                for(var i = 0;i < calendars.length;i++)
                {
                    if (calendars[i]["id"] == idCalendar)
                    {
                        console.log("\tcalendar found");
                        calendars[i]["name"] = name;
                        calendars[i]["url"] = url;
                        calendars[i]["agenda"] = agenda;
                        break;
                    }
                }
                localStorage.setItem("calendars", JSON.stringify(calendars));
            }

        var _addCalendar =
            /**
             * Add a new calendar in the local storage
             */
            function(name, url, agenda)
            {
                console.log("_addCalendar");
                var calendars = JSON.parse(localStorage.getItem("calendars"));
                //console.log("\t" + name + " " + url + " " + agenda);
                var newCalendar = _createCalendar(localStorage.getItem("nextID"), name, url, agenda);
                console.log("\tCalendar added: ", newCalendar);
                calendars.push(newCalendar);
                localStorage.setItem("nextID", parseInt(localStorage.getItem("nextID")) + 1);
                localStorage.setItem("calendars", JSON.stringify(calendars));
            }

        var _saveNewCalendar =
            function(calendarName, url, agenda)
            {
                if (url != "" && calendarName != "")
                {
                    var contentIcal = _downloadIcal(url, calendarName);
                    if (contentIcal != null)
                    {
                        var listEvents = _getAllEvents(contentIcal);
                        _updateEvents(localStorage.getItem("nextID"), listEvents);
                        _addCalendar(calendarName, url, agenda);
                    }
                    return (true);
                }
                else
                {
                    var myPopup = $ionicPopup.confirm
                    (
                        {
                            title: cc_text_confirm,
                            template: cc_text_calendar_field_to_fill,
                            cssClass: "cc-popup-remove",
                            buttons:
                            [
                                {
                                    type: "cc-button-theme",
                                    text: cc_text_validate,
                                }
                            ]
                        }
                    );
                    return (false);
                }
            }

        var _updateSavedCalendar =
            function(calendarObject, name, url, agenda)
            {
                if (url != "" && calendarName != "")
                {
                    _updateCalendar(calendarObject["id"], name, url, agenda);
                    if (url != calendarObject["url"])
                    {
                        var contentIcal = _downloadIcal(url, calendarName);
                        if (contentIcal != null)
                        {
                            var listEvents = _getAllEvents(contentIcal);
                            _updateEvents(calendarObject["id"], listEvents);
                            /* Show a popup with choice to edit events or go to home page ? */
                            $state.go("menu.home");
                        }
                    }
                }
                else
                {
                    var myPopup = $ionicPopup.confirm
                    (
                        {
                            title: cc_text_confirm,
                            template: cc_text_calendar_field_to_fill,
                            cssClass: "cc-popup-remove",
                            buttons:
                            [
                                {
                                    type: "cc-button-theme",
                                    text: cc_text_validate,
                                }
                            ]
                        }
                    );
                }
            }

        var _createEvent =
            /**
             * Create an event object with synchronize sent to false by
             * defautl, and the original name is the same than the edited name.
             * The timestamp is not registered because we must download and
             * parse the ical file every time we want to update. And, the
             * timestamp can change.
             */
            function(name)
            {
                return (
                {
                    synchronize: false,
                    originalName: name,
                    editedName: name
                });
            }

        var _createEventsForAgenda =
            function(calendarID)
            {
                var listEvents = [];
                var calendar = _getCalendarFromId(calendarID);
                var savedEventsList = _getEventsByCalendarID(calendarID);
                var dataIcal = _downloadIcal(calendar["url"], calendar["name"]);
                if (dataIcal == null)
                    return (listEvents);
                var dataJcal = ICAL.parse(dataIcal);
                var comp = new ICAL.component(dataJcal);
                var eventsJcal = comp.getAllSubcomponents("vevent");
                for(var i = 0;i < eventsIcal.length;i++)
                {
                    if (_isSynchronizedEvent(savedEventsList, eventsJcal[i]))
                    {
                        /* Get Time end and get time begin */
                        console.log(eventsJcal);
                    }
                }
            }

        var _isSavedEvent =
            /**
             * Documentation must be done
             */
            function(listEvents, eventJSON)
            {
                for(var i = 0;i < listEvents.length;i++)
                {
                    if (listEvents[i]["originalName"] == eventJSON["originalName"])
                        return (true);
                }
                return (false);
            }

        var _isSynchronizedEvent =
            /**
             * Check if an eventJcal is a saved events in the JSON data
             */
            function(savedEvents, eventJcal)
            {
                for(var i = 0;i < savedEvents.length;i++)
                {
                    if (savedEvents["orginalName"] == eventJcal.summary)
                        return (savedEvents["synchronize"]);
                }
                return (false);
            }

        var _getAllEvents =
            /**
             * Parse an ical file (sent as plaint text in parameter 'success'
             * and returns all events with original name.
             */
            function(success)
            {
                console.log("\tgetAllEvents");
                var listEvents = [];
                var data = ICAL.parse(success);
                var comp = new ICAL.Component(data);
                var eventsIcal = comp.getAllSubcomponents("vevent");
                for(var i = 0;i < eventsIcal.length;i++)
                {
                    var event = new ICAL.Event(eventsIcal[i]);
                    var eventJSON = _createEvent(event.summary);
                    if (! _isSavedEvent(listEvents, eventJSON))
                        listEvents.push(eventJSON);
                }
                return (listEvents);
            }

        var _updateEvents =
            /**
             * Update events in the local storage. The first parameters is the
             * calendar id and the second is the events list.
             */
            function(id, listEvents)
            {
                console.log("\tupdateEvents");
                var events = JSON.parse(localStorage.getItem("events"));
                var found = false;
                for(var i = 0;i < events.length;i++)
                {
                    if (events[i]["calendarID"] == id)
                    {
                        found = true;
                        events[i]["events"] = listEvents;
                    }
                }
                if (!found)
                {
                    events.push
                    (
                        {
                            calendarID: id,
                            events: listEvents
                        }
                    );
                }
                localStorage.setItem("events", JSON.stringify(events));
            }

        var _getEventsByCalendarID =
            /**
             * Return all events registered in the local storage within the
             * calendar with calendarID as id in the local storage
             */
            function(calendarID)
            {
                console.log("\tgetEventsByCalendarID");
                var events = JSON.parse(localStorage.getItem("events"));
                for(var i = 0;i < events.length;i++)
                {
                    if (events[i]["calendarID"] == calendarID)
                        return (events[i]["events"]);
                }
                return ([]);
            }

        return (
        {
            "createEvent":              _createEvent,
            "createEventsForAgenda":    _createEventsForAgenda,
            "isSavedEvent":             _isSavedEvent,
            "isSynchronizedEvent":      _isSynchronizedEvent,
            "getAllEvents":             _getAllEvents,
            "updateEvents":             _updateEvents,
            "getEventsByCalendarID":    _getEventsByCalendarID,

            "createCalendar":           _createCalendar,
            "scanQRCode":               _scanQRCode,
            "downloadIcal":             _downloadIcal,
            "getAllCalendars":          _getAllCalendars,
            "getCalendarFromId":        _getCalendarFromID,
            "getAgendaIndice":          _getAgendaIndice,
            "updateCalendar":           _updateCalendar,
            "addCalendar":              _addCalendar,
            "saveNewCalendar":          _saveNewCalendar,
            "updateSavedCalendar":      _updateSavedCalendar
        });
    }
);
