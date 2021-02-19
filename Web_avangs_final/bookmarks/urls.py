from django.urls import path
from . import views

app_name = 'bookmarks'

urlpatterns = [
    path('', views.bookmarks, name='bookmarks'),
    path('map/', views.map, name='map'),
    path('delete/', views.p_delete, name='p_delete')
]
