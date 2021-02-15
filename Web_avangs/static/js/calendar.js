function loadCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'ko',
        editable: true,
        selectable: true,
        eventTextColor: 'white',
        eventBorderColor: 'royalblue',
        eventBackgroundColor: 'royalblue',

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
                url: 'http://localhost:8000/calendars/load',
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

        eventSources: [
            {
                googleCalendarId: 'ko.south_korea#holiday@group.v.calendar.google.com',
                className: '대한민국 휴일',
                color: 'red',
                allDay: false,
                startEditable: false,
                durationEditable: false
            },
        ],

        eventClick: function (event) {
            console.log(event);

            if (event.el.origin === "https://www.google.com") {
                event.jsEvent.preventDefault();
            }
            else {
                $('#fixEventName').val(event.event.title);
                $('#fixStartDate').val(moment(event.event.start).format('YYYY-MM-DD'));
                $('#fixEndDate').val(moment(event.event.end).subtract(1, 'days').format('YYYY-MM-DD'));
                $('#fixEventLocation').val(event.event.extendedProps.location);
                $('#fixDetailAddress').val(event.event.extendedProps.address);

                $('#fixModal').modal('show');

                // 수정 버튼
                $('#fixSubmitSave').unbind()
                $('#fixSubmitSave').on('click', function () {

                    let e_title = $('#fixEventName').val()
                    let e_start = $('#fixStartDate').val()
                    let e_end = moment(event.event.end).format('YYYY-MM-DD')
                    let e_location = $('#fixEventLocation').val()
                    let e_address = $('#fixDetailAddress').val()
                    let e_id = event.event.id

                    $.ajax({
                        url: 'http://localhost:8000/calendars/fix/',
                        type: 'GET',
                        dataType: 'json',
                        contentType: "application/json",
                        data: {
                            e_title: e_title,
                            e_start: e_start,
                            e_end: e_end,
                            e_location: e_location,
                            e_address: e_address,
                            e_id: e_id
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

                    if (confirm('정말로 일정을 삭제 하시겠습니까?')) {
                        let e_id = event.event.id

                        $.ajax({
                            url: 'http://localhost:8000/calendars/delete/',
                            type: 'GET',
                            dataType: 'json',
                            contentType: "application/json",
                            data: {
                                e_id: e_id
                            },
                            success: function (result, successCallback, failureCallback) {

                                alert('정상적으로 객체가 출력되었습니다.')
                                event.event.remove()
                            },

                            error: function (result, status, error) {
                                alert("code:" + result.status + "\n" + "message:" + result.responseText + "\n" + "error:" + error)
                                console.log(result)
                            }
                        })

                        $('#fixModal').modal('hide');
                        }
                    });
                }
        },

        select: function (info) {
            console.log(info)

            if (confirm('새로운 일정을 추가하시겠습니까?')) {


                $('#eventStartDate').val(moment(info.start).format('YYYY-MM-DD'))
                $('#eventEndDate').val(moment(info.end).subtract(1, 'days').format('YYYY-MM-DD'))
                $('#fullCalModal').modal('show');

                $('#submitSave').unbind()
                $('#submitSave').on('click', function () {
                    alert('일정을 저장하겠습니다.')

                    let e_title = $('#eventName').val()
                    let e_start = $('#eventStartDate').val()
                    let e_end = moment(info.end).format('YYYY-MM-DD')
                    let e_location = $('#eventLocation').val()
                    let e_address = $('#detailAddress').val()


                    $.ajax({
                        url: 'http://localhost:8000/calendars/save/',
                        type: 'GET',
                        dataType: 'json',
                        contentType: "application/json",
                        data: {
                            e_title: e_title,
                            e_start: e_start,
                            e_end: e_end,
                            e_location: e_location,
                            e_address: e_address
                        },
                        success: function (result, successCallback, failureCallback) {

                            console.log(result.title)

                            calendar.addEvent({
                                title: result.title,
                                start: result.start,
                                end: result.end,
                                location: result.location,
                                address: result.address,
                                id: result.id
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
                    });

                $('#eventDefault').unbind();
                $('#eventDefault').on('click', function () {
                    $('#eventName').val('')
                    $('#eventStartDate').val('')
                    $('#eventLocation').val('')
                    $('#eventEndDate').val('')
                    $('#detailAddress').val('')
                })
            }
        },

        // 일정 리사이즈 시 날짜 수정
        eventResize: function (info) {
            console.log(info.event)

            if(confirm('일정 날짜를 수정하시겠습니까?')){
                let e_end = moment(info.event.end).format('YYYY-MM-DD')
                $.ajax({
                        url: 'http://localhost:8000/calendars/resize/',
                        type: 'GET',
                        dataType: 'json',
                        contentType: "application/json",
                        data: {
                            e_end: e_end,
                            e_id: info.event.id
                        },
                        success: function (result, successCallback, failureCallback) {

                            console.log(result.end)
                            alert('정상적으로 날짜가 수정되었습니다.')

                        },
                        error: function(result,status,error) {
                          alert("code:"+result.status+"\n"+"message:"+result.responseText+"\n"+"error:"+error)
                          console.log(result)
                        }
                      })
            }
        },

        // 일정 드래그앤드롭 시 데이터 수정
        eventDrop: function(info){
            console.log(info.event)

            if(confirm('일정 날짜를 수정하시겠습니까?')){
                let e_start = moment(info.event.start).format('YYYY-MM-DD')
                let e_end = moment(info.event.end).format('YYYY-MM-DD')

                $.ajax({
                        url: 'http://localhost:8000/calendars/drop/',
                        type: 'GET',
                        dataType: 'json',
                        contentType: "application/json",
                        data: {
                            e_start: e_start,
                            e_end: e_end,
                            e_id: info.event.id
                        },
                        success: function (result, successCallback, failureCallback) {

                            console.log(result.start)
                            alert('정상적으로 날짜가 수정되었습니다.')

                        },
                        error: function(result,status,error) {
                          alert("code:"+result.status+"\n"+"message:"+result.responseText+"\n"+"error:"+error)
                          console.log(result)
                        }
                      })
            }
        }

    });
        calendar.render();
};

// 자바스크립트 안에서 POST 방식으로 ajax 해야 할 때 필요한 보안 코드
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


// 여기서부터 캘린더, 지도 실행
if (document.readyState !== 'complete') {

    document.addEventListener('DOMContentLoaded', loadCalendar);

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div
        mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);

    $('#fixModal').on('shown.bs.modal', function (e) {

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        let address = $('#fixDetailAddress').val()

        geocoder.addressSearch(address, function(result, status) {
            console.log(result)
            console.log(status)
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {

                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                // // 인포윈도우로 장소에 대한 설명을 표시합니다
                // var infowindow = new kakao.maps.InfoWindow({
                //     content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
                // });
                // infowindow.open(map, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
                map.relayout();

                var roadviewContainer = document.getElementById('roadview'); //로드뷰를 표시할 div
                var roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
                var roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

                var position = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
                roadviewClient.getNearestPanoId(position, 50, function(panoId) {
                    roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
                });
            }
        });
    });

    $('#fixModal').on('shown.bs.modal', function (e) {
                   console.log(e)
                   map.relayout()
                });
}
else {
    loadCalendar();
}