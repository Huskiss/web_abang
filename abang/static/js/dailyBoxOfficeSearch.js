
function my_func() {
    // 사용자가 입력한 날짜를 가져와서
    // 해당 날짜에 대한 boxoffice 순위를 알려주는 서버쪽 웹 프로그램을 호출
    // 그 결과를 화면에 출력
    let user_date = $('#userInputDate').val()
    let user_key = '629d53a9d31fcd5c14481b3797a7f22f'
    let open_api = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json'
    // let my_url = open_api + '?key=' + user_key + '&targetDt=' + user_date

    // 이렇게 하면 화면 refresh가 일어나서 원하는 작업을 할 수 없어요!
    // location.href = my_url
    // 이 문제를 해결하기 위해서 JavaScript가 가지고 있는 특별한 통신방식을 이용!
    // AJAX 통신방식을 이용해서 이 문제를 해결해 보아요!
    // 순수 JavaScript의 AJAX 코드가 구현하기 너무 어렵고 힘들기 때문에 jQuery를 이용해서
    // AJAX를 구현할 꺼에요!
    $.ajax({
        url : open_api,    // 호출할 서버쪽 프로그램의 URL
        type : 'GET',      // 서버쪽 프로그램에 대한 request 방식
        dataType : 'json', // 서버프로그램이 결과로 보내주는 데이터의 형식(json)
        data : {
            key : user_key,
            targetDt : user_date
        },
        success : function(result) {
            $('#my_tbody').empty()

            // alert("서버호출성공!!")
            // 서버로부터 결과 json을 받아왔어요!
            // json은 단순 문자열 => 사용하기 쉽지 않아요
            // json => javascript 객체로 변환
            let movie_list = result['boxOfficeResult']['dailyBoxOfficeList']
            for(let i=0; i<movie_list.length; i++) {
                let m_name = movie_list[i].movieNm
                let m_rank = movie_list[i].rank
                let m_sales = movie_list[i].salesAcc

                // 데이터를 가져왔으니 이제 HTML element를 생성
                //     <tr>
                //         <td>1</td>
                //         <td>건축학개론</td>
                //         <td>포스터</td>
                //         <td>매출액</td>
                //         <td>
                //            <input type=button value=삭제>
                //         </td>
                //     </tr>
                let tr = $('<tr></tr>')    // <tr></tr>
                let rank_td = $('<td></td>').text(m_rank)  // <td>1</td>
                let title_td = $('<td></td>').text(m_name) // <td>건축학개론</td>
                let img_td = $('<td></td>')
                let img_tag = $('<img />').attr('data-title',m_name)
                let sales_td = $('<td></td>').text(m_sales)
                let poster_td = $('<td></td>')
                let poster_btn = $('<input />').attr('type','button')
                    .attr('value','포스터보기')

                poster_btn.on('click',function() {
                    let mv_title = $(this).parent().parent().children().eq(1).text()
                    let result_img = $(this).parent().parent().children().find('[data-title]')
                    $.ajax({
                        url : 'https://dapi.kakao.com/v2/search/image',
                        type : 'GET',
                        dataType : 'json',
                        data : {
                            query : mv_title
                        },
                        headers : {
                            Authorization : 'KakaoAK fe9385cf939654f03afaad5ddc06411b'
                        },
                        success : function(result) {
                            // alert('호출에 성공했어요!!')
                            // console.log(result)
                            img_url = result['documents'][0].thumbnail_url;
                            result_img.attr('src',img_url)
                        },
                        error : function() {
                            alert('먼가 이상해요!!')
                        }
                    })
                })

                poster_td.append(poster_btn)
                img_td.append(img_tag)

                tr.append(rank_td)
                tr.append(title_td)
                tr.append(img_td)
                tr.append(sales_td)
                tr.append(poster_td)
                $('#my_tbody').append(tr)
            }
        },
        error : function() {
            alert('먼가 이상해요!!!')
        }
    })

}