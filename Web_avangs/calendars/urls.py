from django.urls import path
from . import views

app_name = 'calendars'

urlpatterns = [
    path('', views.calendar, name='calendar'),
    path('save/', views.save, name='save'),
    path('load/', views.load, name='load'),
    path('practice/', views.practice, name='practice'),
    path('fix/', views.fix, name='fix'),
    path('delete/', views.delete, name='delete'),
    path('map/', views.map, name='map'),
    path('resize/', views.resize, name='resize'),
    path('drop/', views.drop, name='drop'),
]