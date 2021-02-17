from django.urls import path, include
from . import views

app_name = 'maps'

urlpatterns = [
    path('', views.maps, name='maps'),
    path('mapsProcess/', views.maps_process, name='maps_process'),
    path('booksProcess/', views.books_process, name='books_process'),
]