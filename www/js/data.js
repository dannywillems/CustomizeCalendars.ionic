localStorage.setItem("nextID", 5);

var SYNCHRONISATION =
    {
        automatic: 0,
        /* TODO: think about a way to represent the time synchronisation */
        manual: 1
    };

localStorage.setItem
(
    "calendars",
    JSON.stringify
    (
        [
            {
                id: "1",
                name: "UMONS MA1 Math FA",
                agenda: "2",
                synchronisation: SYNCHRONISATION.manual,
                /* TODO: think about a way to represent the time synchronisation */
                time_synchronisation: null,
                url: "https://hplanning2015.umons.ac.be/Telechargements/ical/EdT_MAB1_en_sciences_mathematiques__FA.ics?version=13.0.2.1&idICal=C16CCBF2F5D2E0FE398916B7A03CDD21&param=643d5b312e2e36325d2666683d3126663d3131303030"
            },
            {
                id: "2",
                name: "UMONS MA1 Math Finalité informatique",
                agenda: "2",
                synchronisation: SYNCHRONISATION.manual,
                /* TODO: think about a way to represent the time synchronisation */
                time_synchronisation: null,
                url: "https://hplanning2015.umons.ac.be/Telechargements/ical/EdT_MAB1_en_sciences_mathematiques__FA.ics?version=13.0.2.1&idICal=C16CCBF2F5D2E0FE398916B7A03CDD21&param=643d5b312e2e36325d2666683d3126663d3131303030"
            },
            {
                id: "3",
                name: "ULB Bac 3 Math",
                agenda: "2",
                synchronisation: SYNCHRONISATION.manual,
                /* TODO: think about a way to represent the time synchronisation */
                time_synchronisation: null,
                url: "https://hplanning2015.umons.ac.be/Telechargements/ical/EdT_MAB1_en_sciences_mathematiques__FA.ics?version=13.0.2.1&idICal=C16CCBF2F5D2E0FE398916B7A03CDD21&param=643d5b312e2e36325d2666683d3126663d3131303030"
            },
            {
                id: "4",
                name: "UMONS MA1 Sciences de gestion FS",
                agenda: "2",
                synchronisation: SYNCHRONISATION.manual,
                /* TODO: think about a way to represent the time synchronisation */
                time_synchronisation: null,
                url: "https://hplanning2015.umons.ac.be/Telechargements/ical/EdT_MAB1_en_sciences_mathematiques__FA.ics?version=13.0.2.1&idICal=C16CCBF2F5D2E0FE398916B7A03CDD21&param=643d5b312e2e36325d2666683d3126663d3131303030"
            }
        ]
    )
);

localStorage.setItem
(
    "events",
    JSON.stringify
    (
        [
            {
                calendarID: "1",
                events:
                [
                    {
                        synchronize: true,
                        originalName: "S-MATH-048 - Projet Math. effectives",
                        editedName: "Math effec"
                    },
                    {
                        synchronize: false,
                        originalName: "S-MATH-044 - Projet d'analyse mathématique",
                        editedName: "Analyse IV"
                    }
                ]
            },
            {
                calendarID: "2",
                events:
                [
                    {
                        synchronize: true,
                        originalName: "S-MATH-048 - Projet Math. effectives",
                        editedName: "Math effec"
                    },
                    {
                        synchronize: false,
                        originalName: "S-MATH-044 - Projet d'analyse mathématique",
                        editedName: "Analyse IV"
                    }
                ]
            },
            {
                calendarID: "3",
                events:
                [
                    {
                        synchronize: true,
                        originalName: "S-MATH-048 - Projet Math. effectives",
                        editedName: "Math effec"
                    },
                    {
                        synchronize: false,
                        originalName: "S-MATH-044 - Projet d'analyse mathématique",
                        editedName: "Analyse IV"
                    }
                ]
            },
            {
                calendarID: "4",
                events:
                [
                    {
                        synchronize: true,
                        originalName: "S-MATH-048 - Projet Math. effectives",
                        editedName: "Math effec"
                    },
                    {
                        synchronize: false,
                        originalName: "S-MATH-044 - Projet d'analyse mathématique",
                        editedName: "Analyse IV"
                    }
                ]
            }
        ]
    )
);
