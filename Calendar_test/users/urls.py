from django.urls import path
from django.views.generic.base import TemplateView
from . import views

app_name = 'users'

urlpatterns = [
    path('login/', views.login, name='login'),
    path('loginProcess/', views.login_process, name='login_process'),
    path('signup/', views.signup, name='signup'),
    path('signupProcess/', views.signup_process, name='signupProcess'),
    path('logout/', views.logout, name='logout'),
]