function my_func(){
    // 사용자가 입력한 날짜를 가져와서
    // 해당 날짜에 대한 boxoffice 순위를 알려주는
    // 서버쪽 웹 프로그램을 호출하고
    // 그 결과를 화면에 출력

    let user_date = $('#userInputData').val()
    let user_key = 'd666cbf6f3b1ff4e48517a6d1b7f3166'
    let open_api = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json'
    // let my_url = open_api + '?key=' + user_key + '&targetDt=' + user_date
    //
    // location.href = my_url
    // ==> 이렇게 하면 화면 refresh가 일어나서 원하는 작업을 할 수 없다.

    // 이 문제를 해결하기 위해
    // JavaScript가 가지고 있는 특별한 통신방식을 이용!!
    // ==> 이것이 바로 AJAX

    // 순수 Javascript의 AJAX 코드 구현이 너무 어렵고 힘들어서
    // jQuery 이용할 예정!

    // jQuery가 가진 기능 중에 ajax를 이용할 때 사용 문법
    // javascript의 객체인 '{key : value}' 이용
    // url == 내가 호출할 서버쪽 프로그램 입력
    // type == 호출을 어떤 방식으로 할거냐? (get or post)
    // dataType == 결과 data가 어떤 형태로 오느냐 (csv, xml, json ??)
    // data == 서버에 넘겨줘야 할 data
    // 넘겨줄 데이터가 2개여서 value 쪽에 또다시 javascript 객체 부여

    $.ajax({
        url : open_api,
        type : 'GET',
        dataType : 'json',
        data : {
            key : user_key,
            targetDt : user_date
        },
        success : function(result) {
            $('#my_tbody').empty()
            //alert('서버 호출 성공')
            // ==> 서버로부터 결과 json을 받아왔어요.
            // ==> 함수의 인자로 json 결과가 대입된다.
            // ==> json은 단순 문자열이라서 사용하기 쉽지 않다.
            // ==> 그래서 json을 javascript 객체로 변환 가능하다. (형식이 동일하기 때문에!)
            // ==> 감사하게 jQuery가 자동으로 받아온 json을 javascript 객체로 변환시켜 return 해준다.
            // console.log(result['boxOfficeResult']['boxOfficeType'])
            let movie_list = result['boxOfficeResult']['dailyBoxOfficeList']
            for(let i=0; i<movie_list.length; i++) {
                let m_name = movie_list[i].movieNm
                let m_rank = movie_list[i].rank
                let m_sales = movie_list[i].salesAcc
                // let m_openDt = movie_list[i].openDt
                // let m_audi = movie_list[i].audiAcc

                let tr = $('<tr></tr>')
                let rank_td = $('<td></td>').text(m_rank)
                let title_td = $('<td></td>').text(m_name)
                let img_td = $('<td></td>')
                let sales_td = $('<td></td>').text(m_sales)

                // 삭제 버튼 만들고 추가하고, 이벤트 발생까지지
                // let delete_td = $('<td></td>')
                // let delete_button = $('<input />').attr('type','button')
                //     .attr('value','삭제')
                // delete_button.on('click',function(){
                //     $(this).parent().parent().remove()
                // })
                // delete_td.append(delete_button)

                // 포스터 보기 버튼
                let poster_td = $('<td></td>')
                let poster_button = $('<input />').attr('type','button')
                    .attr('value','보기')
                poster_button.on('click',function(){
                    let keyword = '영화 포스터' + m_name;
                    let kakao_url = "https://dapi.kakao.com/v2/search/image"

                    $.ajax({
                        url : kakao_url,
                        type : 'GET',
                        dataType : 'json',
                        data : {
                            query : keyword,
                            size : 10
                        },
                        headers : {
                            Authorization : 'KakaoAK 7a3ed81af7c2aa2be7912bbb20b5f70b'
                        },
                        success : function(result) {
                            let img_url = result['documents'][2]['thumbnail_url'];
                            let image = $('<img />').attr('src', img_url);
                            img_td.append(image);

                        },
                        error : function () {
                            alert('뭔가 이상해요')
                        }

                    })

                })
                poster_td.append(poster_button)


                // let open_td = $('<td></td>').text(m_openDt)

                // 'tr' element에 자식으로 각 element 추가
                tr.append(rank_td)
                tr.append(title_td)
                tr.append(img_td)
                tr.append(sales_td)
                tr.append(poster_td)
                // tr.append(open_td)

                $('#my_tbody').append(tr)
            }
        },
        error : function () {
            alert('뭔가 이상해요!')
        }
    })

}

