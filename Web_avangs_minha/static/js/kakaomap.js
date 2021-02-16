function call_cal(){
    let title = $('#title').text()
    let address1 = $('#address1').text()
    let address2 = $('#address2').text()
    let call = $('#call').text()
    let date1 = $('#date1').val()
    let date2 = $('#date2').val()
    let content = $('#content').val()
    let position_y = markerPosition_y
    let position_x = markerPosition_y


    $.ajax({
        url : '/maps/mapsProcess',  // 호출할 서버쪽 프로그램의 URL, Query String 제외
        type : 'GET',        // 서버쪽 프로그램에 대한 request 방식
        dataType : 'json',   // 서버쪽 프로그램에서 response되는 데이터 형식(json)
        contentType: "application/json",
        data : {
            title : title,
            address1 : address1,
            address2 : address2,
            call : call,
            date1 : date1,
            date2 : date2,
            content : content,
            position_y : position_y,
            position_x : position_x
        },                   // 서버쪽 프로그램을 호출하기 위해 주어야 하는 data , 알아서 data를 GET방식의
                             // Query String 형식으로 만들어 준다!!
        success : function(result) {
            alert("잘 출력됐습니다!!")
        },
        error : function() {
            alert("뭔가 이상해요!!")
        }

    })

}

function modal123(){
   // alert("modal입니다!!")

    const modal = document.querySelector(".modal");
    const closeButton = modal.querySelector("#close");
//동작함수

    modal.classList.remove("hidden");

    const closeModal = () => {
        modal.classList.add("hidden");
    }

    closeButton.addEventListener("click", closeModal);
//-->

}

function call_book(){
    let title = $('#title').text()
    let category = $('#category').val()
    let category_chart = $('#category_chart').val()
    let address1 = $('#address1').text()
    let call = $('#call').text()

    alert(category)
    alert(category_chart)

    if (category == '') {
        alert('카테고리가 없어요!!')
        $.ajax({
            url: '/maps/booksProcess',  // 호출할 서버쪽 프로그램의 URL, Query String 제외
            type: 'GET',        // 서버쪽 프로그램에 대한 request 방식
            dataType: 'json',   // 서버쪽 프로그램에서 response되는 데이터 형식(json)
            contentType: "application/json",
            data: {
                category: category_chart,
                address1: address1,
                title: title,
                call: call,
            },                   // 서버쪽 프로그램을 호출하기 위해 주어야 하는 data , 알아서 data를 GET방식의
                                 // Query String 형식으로 만들어 준다!!
            success: function (result) {
                alert("잘 출력됬습니다!!")
            },
            error: function () {
                alert("뭔가 이상해요!!")
            }

        })
    }

    else {
        alert('카테고리가 있어요!!')
        $.ajax({
            url: '/maps/booksProcess',  // 호출할 서버쪽 프로그램의 URL, Query String 제외
            type: 'GET',        // 서버쪽 프로그램에 대한 request 방식
            dataType: 'json',   // 서버쪽 프로그램에서 response되는 데이터 형식(json)
            contentType: "application/json",
            data: {
                category: category,
                address1: address1,
                title: title,
                call: call,
            },                   // 서버쪽 프로그램을 호출하기 위해 주어야 하는 data , 알아서 data를 GET방식의
                                 // Query String 형식으로 만들어 준다!!
            success: function (result) {
                alert("잘 출력됬습니다!!")
            },
            error: function () {
                alert("뭔가 이상해요!!")
            }

        })
    }
}
