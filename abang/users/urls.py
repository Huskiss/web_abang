
from django.urls import path, include
from . import views

app_name = 'users'

urlpatterns = [
    # localhost:8000/users/login/
    path('login/', views.login, name='login'),
# localhost:8000/users/loginProcess/
    path('loginProcess/', views.login_process, name='login_process'),
    # localhost:8000/users/signup/
    path('signup/', views.signup, name='signup'),
    # localhost:8000/users/signupProcess/
    path('signupProcess/', views.signup_process, name='signup_process'),
    # localhost:8000/users/logout/
    path('logout/', views.logout, name='logout')
]
