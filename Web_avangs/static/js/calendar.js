
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
                    alert("error:" + error)
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
                $('#fix_color_select').val(event.event.backgroundColor)

                $('#fixModal').modal('show');

                // 수정 버튼
                $('#fixSubmitSave').unbind()
                $('#fixSubmitSave').on('click', function () {
                    let end_val = $('#fixEndDate').val()
                    let end_date = formatDate(end_val)


                    let e_title = $('#fixEventName').val()
                    let e_start = $('#fixStartDate').val()
                    let e_end = end_date
                    let e_location = $('#fixEventLocation').val()
                    let e_address = $('#fixDetailAddress').val()
                    let e_color = $('#fix_color_select').val()
                    let e_id = event.event.id

                    $.ajax({
                        url: '/calendars/fix/',
                        type: 'GET',
                        dataType: 'json',
                        contentType: "application/json",
                        data: {
                            e_title: e_title,
                            e_start: e_start,
                            e_end: e_end,
                            e_location: e_location,
                            e_address: e_address,
                            e_id: e_id,
                            e_color: e_color
                        },
                        success: function (result, successCallback, failureCallback) {

                            alert('정상적으로 수정되었습니다.')
                            event.event.setProp('title', result.title);
                            event.event.setProp('backgroundColor', result.color);
                            event.event.setProp('borderColor', result.color);
                            event.event.setExtendedProp('location', result.location);
                            event.event.setExtendedProp('address', result.address);
                            event.event.setExtendedProp('description', result.description);
                            event.event.setDates(result.start, result.end, {allDay: true});

                        },
                        error: function(result,status,error) {
                          alert("error:"+error)
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
                            url: '/calendars/delete/',
                            type: 'GET',
                            dataType: 'json',
                            contentType: "application/json",
                            data: {
                                e_id: e_id
                            },
                            success: function (result, successCallback, failureCallback) {
                                event.event.remove()
                                alert('정상적으로 삭제 되었습니다.')
                            },

                            error: function (result, status, error) {
                                alert("error:" + error)
                            }
                        })

                        $('#fixModal').modal('hide');
                        }
                    });
                
                // 검색 버튼
                $('#fixSubmitSearch').unbind();
                $('#fixSubmitSearch').on('click', function () {
                    let location = $('#fixEventLocation').val()
                    let kakao_url = 'https://dapi.kakao.com/v2/local/search/keyword'

                    $.ajax({
                        url: kakao_url,
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            query : location,
                        },
                        headers: {
                            Authorization: 'KakaoAK 926d2e88f9d93265d11e526d2ffe8536'
                        },
                        success: function (result) {
                            alert('도로명 주소를 불러왔어요.')
                            console.log(result)
                            let doro = result['documents'][0]['road_address_name']
                            $('#fixDetailAddress').val(doro)

                        },
                        error: function(result,status,error) {
                          alert("error:"+error)
                        }
                    })
                });
                }
        },

        select: function (info) {
            console.log(info)

            if (confirm('새로운 일정을 추가하시겠습니까?')) {

                let start_date = moment(info.start).format('YYYY-MM-DD')
                let end_date = moment(info.end).subtract(1, 'days').format('YYYY-MM-DD')
                $('#eventStartDate').val(start_date)
                $('#eventEndDate').val(end_date)
                $('#fullCalModal').modal('show');

                $('#submitSave').unbind()
                $('#submitSave').on('click', function () {
                    alert('일정을 저장하겠습니다.')

                    let e_title = $('#eventName').val()
                    let e_start = $('#eventStartDate').val()
                    let e_end = moment(info.end).format('YYYY-MM-DD')
                    let e_location = $('#eventLocation').val()
                    let e_address = $('#detailAddress').val()
                    let e_color = $('#color_select').val()

                    $.ajax({
                        url: '/calendars/save/',
                        type: 'GET',
                        dataType: 'json',
                        contentType: "application/json",
                        data: {
                            e_title: e_title,
                            e_start: e_start,
                            e_end: e_end,
                            e_location: e_location,
                            e_address: e_address,
                            e_color: e_color
                        },
                        success: function (result, successCallback, failureCallback) {

                            calendar.addEvent({
                                title: result.title,
                                start: result.start,
                                end: result.end,
                                location: result.location,
                                address: result.address,
                                borderColor: result.color,
                                backgroundColor: result.color,
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
                    $('#color_select').val('')
                    });

                $('#eventDefault').unbind();
                $('#eventDefault').on('click', function () {
                    $('#eventName').val('')
                    $('#eventStartDate').val('')
                    $('#eventLocation').val('')
                    $('#eventEndDate').val('')
                    $('#detailAddress').val('')
                    $('#color_select').val('')
                })
            }
        },

        // 일정 리사이즈 시 날짜 수정
        eventResize: function (info) {
            console.log(info.event)

            if(confirm('일정 날짜를 수정하시겠습니까?')){
                let e_end = moment(info.event.end).format('YYYY-MM-DD')
                $.ajax({
                        url: '/calendars/resize/',
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
                        url: '/calendars/drop/',
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

// Date날짜 YYYY-MM-DD 형식으로 변환 함수
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate() + 1),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-'); }



// 여기서부터 캘린더 & 지도 실행
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
                   map.relayout()
                });
}
else {
    loadCalendar();
}