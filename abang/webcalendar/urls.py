from django.urls import path
from django.views.generic.base import TemplateView
from . import views

app_name = 'webcalendar'

urlpatterns = [
    path('', views.calendar, name='calendar'),
    path('save/', views.save, name='save'),
    path('load/', views.load, name='load'),
    path('practice/', views.practice, name='practice'),
    path('fix/', views.fix, name='fix')
]