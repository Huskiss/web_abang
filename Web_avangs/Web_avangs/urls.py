from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    # path('bookmarks', include('bookmarks.urls')),
    path('calendars/', include('calendars.urls')),
    path('maps/', include('maps.urls'))
]