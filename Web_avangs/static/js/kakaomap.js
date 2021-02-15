

function call123(){
    let title = $('#title').text()
    let address1 = $('#address1').text()
    let address2 = $('#address2').text()
    let call = $('#call').text()
    let date1 = $('#date1').val()
    let date2 = $('#date2').val()
    let content = $('#content').val()


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
        },                   // 서버쪽 프로그램을 호출하기 위해 주어야 하는 data , 알아서 data를 GET방식의
                             // Query String 형식으로 만들어 준다!!
        success : function(result) {
            alert("잘 출력됬습니다!!")
            console.log(result.content)
        },
        error: function (result, status, error) {
                    alert("code:" + result.status + "\n" + "message:" + result.responseText + "\n" + "error:" + error)
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