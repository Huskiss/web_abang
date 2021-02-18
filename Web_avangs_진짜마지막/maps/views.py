from django.shortcuts import render, redirect
from django.http import HttpResponse
from maps.models import Cal, Book
from calendars.models import Calendar
import json

def maps(request):
    return render(request, 'maps/ui-maps.html', {'page_title': request.session['loginObj']['u_name']})

# def maps(request):
#     return render(request, 'maps/kakaomap_origin.html', {'page_title': request.session['loginObj']['u_name']})

def maps_process(request):

    title = request.GET['title']
    address1 = request.GET['address1']
    address2 = request.GET['address2']
    call = request.GET['call']
    date1 = request.GET['date1']
    date2 = request.GET['date2']
    content = request.GET['content']
    event_id = request.GET['id']
    user_id = request.session['loginObj']['u_name']

    if event_id :
        event = Calendar.objects.get(id=event_id)
        event.username = user_id
        event.title = content
        event.start = date1
        event.end = date2
        event.location = title
        event.address = address1

        event.save()

    else:
        Cal.objects.create(username=user_id,
                           title=title,
                           address1=address1,
                           address2=address2,
                           call=call,
                           date1=date1,
                           date2=date2,
                           content=content)

        Calendar.objects.create(username=user_id,
                                title=content,
                                location=title,
                                address=address1,
                                start=date1,
                                end=date2,
                                color='royalblue')

    context = {'username': user_id,
               'title': title,
               'address1': address1,
               'address2': address2,
               'call': call,
               'date1': date1,
               'date2': date2,
               'content': content
    }

    return HttpResponse(json.dumps(context), content_type='application/json')


def books_process(request):
    category = request.GET['category']
    address1 = request.GET['address1']
    title = request.GET['title']
    call = request.GET['call']
    user_id = request.session['loginObj']['u_name']

    print(type(category))

    Book.objects.create(username=user_id,
                       category=category,
                       address1=address1,
                       title=title,
                       call=call)

    context = {'username': user_id,
               'category': category,
               'address1': address1,
               'title': title,
               'call': call,
               }

    return HttpResponse(json.dumps(context), content_type='application/json')

