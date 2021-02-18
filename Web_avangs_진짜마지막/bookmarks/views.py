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

def map(request):
    location = request.POST['bookmark_location']
    category = request.POST['category']
    context = {
        'location': location,
        'category': category
    }
    return render(request, 'maps/ui-maps_re.html', context)

def p_delete(request):
    Book_id = request.POST['submit_btn']
    print(Book_id)
    Books = Book.objects.get(id=Book_id)
    Books.delete()

    return redirect('bookmarks:bookmarks')