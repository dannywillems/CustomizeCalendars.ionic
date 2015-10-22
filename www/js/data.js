var SYNCHRONISATION =
    {
        automatic: 0,
        /* TODO: think about a way to represent the time synchronisation */
        manual: 1
    };

localStorage.setItem("nextID", localStorage.getItem("nextID") || JSON.stringify("0"));
localStorage.setItem("events", localStorage.getItem("events") || JSON.stringify([]));
localStorage.setItem("calendars", localStorage.getItem("calendars") || JSON.stringify([]));
