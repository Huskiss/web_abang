
from django.urls import path
from . import views

app_name = 'boxoffice'

urlpatterns = [
    # localhost:8000/boxoffice/
    path('search/', views.search, name='search')

]
