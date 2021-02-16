function new_post() {
    location.href = '/bookmarks/create'
}
function loadCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'ko',
        editable: true,
        selectable: true,
        eventTextColor: 'white',

        plugins: ['interaction', 'dayGrid', 'googleCalendar'],

        googleCalendarApiKey: 'AIzaSyAbD4zXWKrX4Qx6lRAdGhbT6jTNMh8c5HA',
        firstDay: 0,

        header: {
            left: 'prev, next ',
            center: 'title',
            right: 'today',
        },


        events: function(info, successCallback, failureCallback) {
            $.ajax({
                url: '/calendars/load',
                type: 'get',
                dataType: 'json',
                contentType: "application/json",
                success: function (result) {
                    load_events = []

                    $.each(result, function (index, element) {
                        load_events.push({
                            title: element.title,
                            start: element.start,
                            end: element.end,
                            location: element.location,
                            address: element.address,
                            borderColor: element.color,
                            backgroundColor: element.color,
                            id: element.id
                        });
                    })

                    successCallback(load_events);
                },
                error: function (result, status, error) {
                    alert("code:" + result.status + "\n" + "message:" + result.responseText + "\n" + "error:" + error)
                }
            });
        },


    });
        calendar.render();
};
