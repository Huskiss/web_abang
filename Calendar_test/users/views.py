from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import auth


def login(request):
    return render(request, 'users/login.html', {
        'page_title': 'User Login',
        'user_data': '소리없는 아우성'
    })

def signup(request):
    return render(request, 'users/signup.html', {'page_title': '회원가입'})

def signup_process(request):
    # request 안에는 POST 방식으로 data가 key(==name) 와 value 쌍으로 넘어온다
    user_id = request.POST['inputId']
    user_pw1 = request.POST['inputPassword1']
    user_pw2 = request.POST['inputPassword2']

    # view에 print로 호출하면, Terminal에 찍힌다. (처음에 확인하는 게 좋음!)
    # print('회원가입 함수 호출 성공')
    # print(user_id)
    # print(user_pw1)
    # print(user_pw2)

    # 이미 존재하는 ID인지 확인하고, 존재하지 않다면 회원가입 처리 진행
    # step1. 모든 사용자 정보 가져오기
    # 내가 사용할 class를 먼저 import ==> from django.contrib.auth.models import User

    user_list = User.objects.all()
    # ==> class 안에 있는 모든 객체 (해당 데이터 table 안에 있는 모든 records)를 가져오기

    if user_list.filter(username=user_id).exists():
        # 현재 회원가입 하려는 ID가 이미 사용돼 있기 때문에
        # 오류메세지와 함께 다시, 회원가입 화면으로 돌아가야 한다.
        # 클라이언트에게 회원가입하는 화면으로 다시 접속하라는 response를 보내줘야 한다! (==redirect)
        # 근데 계속 오류가 나서 ==> render로 change

        return render(request, 'users/signup.html', {
            'err_msg': '이미 가입돼 있는 ID 입니다.'
        })
    elif user_pw1 == user_pw2:
        # 이 경우에 회원가입이 가능!
        User.objects.create_user(username=user_id, password=user_pw1)
        return redirect('home')
    else:
        return render(request, 'users/signup.html', {
            'err_msg': '비밀번호가 다릅니다.'
        })

def login_process(request):
    # 클라이언트로부터 POST 방식으로 ID와 PW가 넘어와요.
    u_id = request.POST['inputId']
    u_pw = request.POST['inputPassword']

    # 로그인이 되는지 확인 (== 데이터베이즈에 해당 ID와 PW가 있는지 확인!)
    # 인증 담당하고 도와주는 함수 사용! ==> auth.authenticate // import 시켜 주기 ==> from django.contrib import auth
    user = auth.authenticate(request, username=u_id, password=u_pw)
    # 인증절차가 제대로 통과하면 그 값이 user안에 객체로 들어가고
    # 인증이 안됐으면, None!

    if user is not None:
        # 로그인 처리를 진행 (== session 처리!)
        # 즉, session이라는 영역에 이 ID가 로그인 했다는 표시를 남겨야 한다!
        # 방법1
        auth.login(request, user)  # 이 방법은 로그인 부분에만 국한된다! / login session에 부착

        # 방법2
        # 딕셔너리 하나 만들기
        # 그 다음 session 처리
        user_dict = {
            'u_id': user.id,
            'u_name': user.username
        }

        # request가 가지고 있는 session을 이용해서, 위에서 만든 딕셔너리 객체를 session에 넣어준다.
        request.session['loginObj'] = user_dict
        return redirect('home')
    else:
        return render(request, 'users/login.html', {
            'err_msg': '로그인 실패입니다.'
        })

def logout(request):
    # session 정보를 만료!!
    auth.logout(request)
    return redirect('home')