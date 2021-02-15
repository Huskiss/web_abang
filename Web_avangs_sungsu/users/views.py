from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import auth


def login(request):
    return render(request, 'users/login.html', {
        'page_title': 'User Login',
        'user_data': '소리없는 아우성'
    })


def signup(request):
    return render(request, 'users/signup.html', {
        'page_title': '회원가입'
    })


def signup_process(request):
    user_id = request.POST['inputId']
    user_password1 = request.POST['inputPassword1']
    user_password2 = request.POST['inputPassword2']

    user_list = User.objects.all()
    if user_list.filter(username=user_id).exists():

        return render(request, 'users/signup.html', {
            'err_msg': '이미 존재하는 ID입니다!!'
        })

    elif user_password1 == user_password2:

        User.objects.create_user(username=user_id, password=user_password1)
        return redirect('home')

    else:

        return render(request, 'users/signup.html', {
            'err_msg': '비밀번호가 달라요!!'
        })


def login_process(request):
    u_id = request.POST['inputId']
    u_pw = request.POST['inputPassword']
    user = auth.authenticate(request, username=u_id, password=u_pw)
    if user is not None:
        auth.login(request, user)
        user_dict = {
            'u_id': user.id,
            'u_name': user.username,
        }
        request.session['loginObj'] = user_dict
        return redirect('home')

    else:
        return render(request, 'users/login.html', {
            'err_msg': '로그인 실패입니다.'
        })


def logout(request):
    auth.logout(request)
    return redirect('home')