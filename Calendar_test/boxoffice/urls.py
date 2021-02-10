from django.urls import path
from django.views.generic.base import TemplateView
from . import views

app_name = 'boxoffice'

urlpatterns = [
    path('search/', views.search, name='search')

]