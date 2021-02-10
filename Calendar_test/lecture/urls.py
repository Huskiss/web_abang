"""lecture URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    # url(): 가장 초기 버전 / path() / re_path() :정규표현식으로 path 잡기
    # 정해져 있는 html을 그냥 바로 띄워주는! ==> TemplateView.as_view()
    # path('', TemplateView.as_view(template_name='index.html'), name='home'),

    # 메인페이지 로그인에 따라 다르게 보이기 위해 프로그램 처리가 필요하다!
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('movie/', include('boxoffice.urls')),
    path('webcalendar/', include('webcalendar.urls'))
]
