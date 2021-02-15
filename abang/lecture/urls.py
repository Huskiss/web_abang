from django.contrib import admin
from django.urls import path, include
# from django.views.generic.base import TemplateView
from . import views


urlpatterns = [
    # url(), path(), re_path()
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('movie/', include('boxoffice.urls')),
    path('webcalendar/', include('webcalendar.urls')),
    path('maps/', include('maps.urls'))
]
