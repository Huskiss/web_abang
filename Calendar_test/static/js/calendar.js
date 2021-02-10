function loadCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'Cosmo',
        locale: 'ko',
        editable: true,
        selectable: true,
        eventTextColor: 'white',
        eventBorderColor: 'royalblue',
        eventBackgroundColor: 'royalblue',
        cache: false,

        plugins: ['interaction', 'dayGrid', 'googleCalendar'],

        googleCalendarApiKey: 'AIzaSyAbD4zXWKrX4Qx6lRAdGhbT6jTNMh8c5HA',
        firstDay: 0,

        customButtons: {
            LoginButton: {
                text: 'test',
                click: function (info) {
                    console.log(info)
                    let loginId = prompt('사용하실 ID를 입력해주세요.');
                    info.target.innerText = loginId + '님 환영합니다.';
                    info.target.ariaReadOnly = true;
                }
            }
        },


        header: {
            left: 'prev, next ',
            center: 'title',
            right: 'LoginButton today',
        },

        eventAfterAllRender: function (view) {
            if ($('.label').length) {
                $('.fc-LoginButton-button').before('<div class="label">test</div>');
            }
        },

        events: [
          $.ajax({
            url: 'http://localhost:8000/webcalendar/practice',
            type: 'get',
            dataType: 'json',
            contentType: "application/json",
            success: function (result, successCallback, failureCallback) {
                alert('정상적으로 객체가 출력되었습니다.')
                console.log(result)
                calendar.addEvent({
                    title: result.title,
                    start: result.start,
                    end: result.end,
                    location: result.location,
                    address: result.address
                });
            },
            error: function(result,status,error) {
              alert("code:"+result.status+"\n"+"message:"+result.responseText+"\n"+"error:"+error)
              console.log(result)
            }
          }),
        ],



        // events: [
        //     {
        //         title: '멀티캠퍼스 방문',
        //         location: '멀티캠퍼스',
        //         address: '서울시 강남구 테헤란로',
        //         description: '조원들과 프로젝트 회의',
        //         start: '2021-02-04',
        //         end: '2021-02-05',
        //         // textColor: 'white'
        //     },
        //     {
        //         title: '처가댁 방문',
        //         location: '광주집',
        //         address: '광주 광역시 남구 장산길',
        //         description: '어머니 아버지 섬김',
        //         start: '2021-02-26',
        //         end: '2021-02-28',
        //         // textColor: 'white'
        //     },
        // ],


        eventSources: [
            {
                googleCalendarId: 'ko.south_korea#holiday@group.v.calendar.google.com',
                className: '대한민국 휴일',
                color: 'red',
                allDay: false,
                startEditable: false,
                durationEditable: false
            },
            {
                googleCalendarId: 'joshua0439@gmail.com',
                className: '내 일정',
                color: 'green',
            },

        ],


        eventDidMount: function (info) {
            console.log(info);
        },

        eventClick: function (event) {
            console.log(event);

            if (event.el.origin === "https://www.google.com") {
                event.jsEvent.preventDefault();
            }
            else {
                $('#fixEventName').val(event.event.title);
                $('#fixStartDate').val(moment(event.event.start).format('YYYY-MM-DD'));
                $('#fixEndDate').val(moment(event.event.end).format('YYYY-MM-DD'));
                $('#fixEventLocation').val(event.event.extendedProps.location);
                $('#fixDetailAddress').val(event.event.extendedProps.address);
                $('#fixEventDescription').val(event.event.extendedProps.description);


                $('#fixModal').modal('show');


                // 수정 버튼
                $('#fixSubmitSave').unbind()
                $('#fixSubmitSave').on('click', function () {

                    let e_title = $('#fixEventName').val()
                    let e_start = $('#fixStartDate').val()
                    let e_end = $('#fixEndDate').val()
                    let e_location = $('#fixEventLocation').val()
                    let e_address = $('#fixDetailAddress').val()
                    let e_description = $('#fixEventDescription').val()

                    $.ajax({
                        url: 'http://localhost:8000/webcalendar/fix/',
                        type: 'GET',
                        dataType: 'json',
                        contentType: "application/json",
                        data: {
                            e_title: e_title,
                            e_start: e_start,
                            e_end: e_end,
                            e_location: e_location,
                            e_address: e_address,
                            e_description: e_description
                        },
                        success: function (result, successCallback, failureCallback) {

                            console.log(result.title)

                            alert('정상적으로 객체가 출력되었습니다.')
                            event.event.setProp('title', result.title);
                            event.event.setExtendedProp('location', result.location);
                            event.event.setExtendedProp('address', result.address);
                            event.event.setExtendedProp('description', result.description);
                            // event.event.setDates($('#fixStartDate').val(),$('#fixEndDate').val());
                            // event.event.cache= false
                        },
                        error: function(result,status,error) {
                          alert("code:"+result.status+"\n"+"message:"+result.responseText+"\n"+"error:"+error)
                          console.log(result)
                        }
                      })


                    $('#fixModal').modal('hide');

                });

                // 삭제
                $('#fixSubmitDelete').unbind();
                $('#fixSubmitDelete').on('click', function () {
                    event.event.remove()
                    $('#fixModal').modal('hide');
                    console.log(event)
                    calendar.render()
                });

            }
        },

        select: function (info) {
            console.log(info)

            if (confirm('새로운 일정을 추가하시겠습니까?')) {


                $('#eventStartDate').val(info.startStr)
                $('#eventEndDate').val(info.endStr)
                $('#fullCalModal').modal('show');

                $('#submitSave').unbind()
                $('#submitSave').on('click', function () {
                    alert('클릭클릭!!')

                    let e_title = $('#eventName').val()
                    let e_start = $('#eventStartDate').val()
                    let e_end = $('#eventEndDate').val()
                    let e_location = $('#eventLocation').val()
                    let e_address = $('#detailAddress').val()
                    let e_description = $('#eventDescription').val()

                    $.ajax({
                        url: 'http://localhost:8000/webcalendar/save/',
                        type: 'GET',
                        dataType: 'json',
                        contentType: "application/json",
                        data: {
                            e_title: e_title,
                            e_start: e_start,
                            e_end: e_end,
                            e_location: e_location,
                            e_address: e_address,
                            e_description: e_description
                        },
                        success: function (result, successCallback, failureCallback) {

                            console.log(result.title)

                            alert('정상적으로 객체가 출력되었습니다.')
                            calendar.addEvent({
                                title: result.title,
                                start: result.start,
                                end: result.end,
                                location: result.location,
                                address: result.address
                            });
                        },
                        error: function(result,status,error) {
                          alert("code:"+result.status+"\n"+"message:"+result.responseText+"\n"+"error:"+error)
                          console.log(result)
                        }
                      })

                    $('#fullCalModal').modal('hide');

                    $('#eventName').val('')
                    $('#eventStartDate').val('')
                    $('#eventLocation').val('')
                    $('#eventEndDate').val('')
                    $('#detailAddress').val('')
                    $('#eventDescription').val('')
                    });

                $('#eventDefault').unbind();
                $('#eventDefault').on('click', function () {
                    $('#eventName').val('')
                    $('#eventStartDate').val('')
                    $('#eventLocation').val('')
                    $('#eventEndDate').val('')
                    $('#detailAddress').val('')
                    $('#eventDescription').val('')
                })
            }
        },
    });
        calendar.render();
};
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


if (document.readyState !== 'complete') {

    document.addEventListener('DOMContentLoaded', loadCalendar);

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div
        mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);

    function relayout() {

        // 지도를 표시하는 div 크기를 변경한 이후 지도가 정상적으로 표출되지 않을 수도 있습니다
        // 크기를 변경한 이후에는 반드시  map.relayout 함수를 호출해야 합니다
        // window의 resize 이벤트에 의한 크기변경은 map.relayout 함수가 자동으로 호출됩니다
        map.relayout();
    };

} else {
    loadCalendar();
}