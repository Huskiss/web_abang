from django.urls import path, include
from . import views

app_name = 'maps'

urlpatterns = [
    # localhost:8000/maps/
    path('', views.maps, name='maps'),
    # localhost:8000/maps/mapsProcess/
    path('mapsProcess/', views.maps_process, name='maps_process'),
    # localhost:8000/maps/booksProcess/
    path('booksProcess/', views.books_process, name='books_process'),
]