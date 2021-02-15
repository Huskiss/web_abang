from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import auth

def login(request):
    # 데이터베이스 처리가 있으면 model을 이용해서 데이터를 가져와요!
    # 로직처리할것이 있으면 로직처리를 진행해요!
    # template을 이용해서 결과 HTML을 만들어서 리턴해요!!

    return render(request, 'users/login.html', {
        'page_title': 'User Login',
        'user_data' : '소리없는 아우성'
    })


def signup(request):
    return render(request, 'users/signup.html', {
        'page_title': '회원가입'
    })


def signup_process(request):
    # name을 이용해서 Value값을 받아온다.
    user_id = request.POST['inputId']
    user_password1 = request.POST['inputPassword1']
    user_password2 = request.POST['inputPassword2']

    # print('회원가입 함수 호출 성공!!')
    # print(user_id)
    # print(user_password1)
    # print(user_password2)
    # 클라이언트가 회원가입을 위해 보내준 데이터를 서버가 받았어요!!
    # 이 ID와 PW를 이용해서 데이터베이스에 저장하면 되요!

    # 사용자 ID는 unique해야 해요!!
    # 이미 존재하는 ID인지를 확인하고 만약 존재하는 ID가 아니면
    # 회원가입처리를 진행
    # 모든 사용자 정보를 가져와요!
    user_list = User.objects.all()
    if user_list.filter(username= user_id).exists():
        # 회원가입하려는 ID가 이미 사용되고 있는 경우
        # 오류메세지와 함께 회원가입 화면으로 다시 돌아가야해요!
        # 클라이언트에게 회원가입하는 화면으로 다시 접속하라는 결과를
        # 보내줘야 해요!

        return render(request, 'users/signup.html', {
            'err_msg': '이미 존재하는 ID입니다!!'
        })

    elif user_password1 == user_password2:
        # 회원가입이 가능!
        User.objects.create_user(username=user_id, password=user_password1)
        return redirect('home')

    else:
        # 입력한 비밀번호가 다른경우
        return render(request, 'users/signup.html', {
            'err_msg':'비밀번호가 달라요!!'
        })


def login_process(request):
    # 클라이언트로부터 POST방식으로 ID와 PW가 넘어와요!
    u_id = request.POST['inputId']
    u_pw= request.POST['inputPassword']
    # 로그인이 되는지 확인해야 해요!(데이터베이스에 해당 ID와 PW가 있는지 확인)
    user = auth.authenticate(request, username=u_id, password=u_pw)
    if user is not None:
        # 로그인 처리(session처리 진행)
        auth.login(request, user)
        user_dict = {
            'u_id': user.id,
            'u_name': user.username,
        }
        # session 처리를 해 보아요!
        request.session['loginObj'] = user_dict
        return redirect('home')

    else:
        return render(request, 'users/login.html', {
            'err_msg': '로그인 실패입니다.'
        })


def logout(request):
    # logout 처리를 해요!
    # session정보를 만료! (session 정보를 삭제)
    auth.logout(request)
    return redirect('home')