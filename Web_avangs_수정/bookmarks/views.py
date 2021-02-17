from django.shortcuts import render, redirect
from django.http import HttpResponse
from bookmarks.models import Post
from bookmarks.forms import PostForm
from maps.models import Book

def bookmarks(request):
    u_id = request.session['loginObj']['u_name']
    posts = Book.objects.filter(username=u_id).order_by('category')
    return render(request, 'bookmarks/ui-tables.html',
                  {'posts': posts,
                  'page_title': request.session['loginObj']['u_name']})

# def bookmarks(request):
#     u_id = request.session['loginObj']['u_name']
#     posts = Book.objects.filter(username=u_id).order_by('category')
#     return render(request, 'bookmarks/list.html',
#                   {'posts': posts,
#                   'page_title': request.session['loginObj']['u_name']})
#
