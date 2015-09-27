angular.module('customizecalendars.services', [])

.factory
(
    'ccCalendarServices',
    function($cordovaCalendar)
    {
        var _createEvent =
            function(name)
            {
                return (
                {
                    originalName: name,
                    editedName: name
                });
            }

        var _createCalendar =
            function(idCalendar, nameCalendar, urlCalendar, agendaCalendar)
            {
                return (
                {
                    id: idCalendar,
                    name: nameCalendar,
                    agenda: agendaCalendar,
                    url: urlCalendar
                });
            }

        var _getAllCalendars =
            function()
            {
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
            function(idCalendar)
            {
                //console.log("getCalendarFromId");
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
            function(calendar, agendaList)
            {
                for(var i = 0;i < agendaList.length;i++)
                {
                    if (calendar["agenda"] == agendaList[i]["id"])
                        return (i);
                }
                return (-1);
            }

        var _isSavedEvent =
            function(listEvents, eventJSON)
            {
                for(var i = 0;i < listEvents.length;i++)
                {
                    if (listEvents[i]["originalName"] == eventJSON["originalName"])
                        return (true);
                }
                return (false);
            }

        var _getAllEvents =
            function(success)
            {
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
            function(id, listEvents)
            {
                console.log("_updateEvents");
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

        var _updateCalendar =
            function(idCalendar, name, url, agenda)
            {
                console.log("_updateCalendar");
                var calendars = JSON.parse(localStorage.getItem("calendars"));
                for(var i = 0;i < calendars.length;i++)
                {
                    if (calenders[i]["id"] == idCalendar)
                    {
                        calendars[i]["name"] = name;
                        calendars[i]["url"] = url;
                        calendars[i]["agenda"] = agenda;
                    }
                }
            }

        var _addCalendar =
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

        return (
        {
            "createCalendar": _createCalendar,
            "createEvent": _createEvent,
            "getAllCalendars": _getAllCalendars,
            "getCalendarFromId": _getCalendarFromID,
            "getAgendaIndice": _getAgendaIndice,
            "isSavedEvent": _isSavedEvent,
            "getAllEvents": _getAllEvents,
            "updateEvents": _updateEvents,
            "updateCalendar": _updateCalendar,
            "addCalendar": _addCalendar

        });
    }
)

.factory
(
    'ccEventsServices',
    function()
    {
        var _getEventsByCalendarID =
            function(calendarID)
            {
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
            "getEventsByCalendarID": _getEventsByCalendarID
        });
    }
);

