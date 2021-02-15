from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib import auth
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.urls import reverse
from webcalendar.models import Calendar
import json

def calendar(request):
    return render(request, 'webcalendar/calendar.html', {'page_title': request.session['loginObj']['u_name']})

def save(request):

    print(request.GET['e_title'])
    event_title = request.GET['e_title']
    event_start = request.GET['e_start']
    event_end = request.GET['e_end']
    event_location = request.GET['e_location']
    event_address = request.GET['e_address']
    event_description = request.GET['e_description']
    event_id = request.session['loginObj']['u_name']

    Calendar.objects.create(username=event_id,
                            title=event_title,
                            start=event_start,
                            end=event_end,
                            location=event_location,
                            address=event_address,
                            description=event_description)


    context = {'username': event_id,
               'title': event_title,
               'start': event_start,
               'end': event_end,
               'location': event_location,
               'address': event_address
               }

    return HttpResponse(json.dumps(context), content_type='application/json')

def load(request):
    calendar_list = get_object_or_404(Calendar)

    return render(request, 'webcalendar/calendar.html', {'results': calendar_list})

def practice(request):
    u_id = request.session['loginObj']['u_name']
    calendar_list = Calendar.objects.filter(username=u_id)
    # context = {'username': calendar_list}
    # print(json.dump(context))
    context = {'username': calendar_list[0].username,
               'title': calendar_list[0].title,
               'start': calendar_list[0].start,
               'end': calendar_list[0].end,
               'location': calendar_list[0].location,
               'address': calendar_list[0].location
               }
    # print(calendar_list[0])
    return HttpResponse(json.dumps(context), content_type='application/json')

def fix(request):
    u_id = request.session['loginObj']['u_name']
    event_title = request.GET['e_title']
    event_start = request.GET['e_start']
    event_end = request.GET['e_end']
    event_location = request.GET['e_location']
    event_address = request.GET['e_address']
    event_description = request.GET['e_description']

    event = Calendar.objects.get(username=u_id, title=event_title)
    print(event.title)
    event.title = event_title
    event.start = event_start
    event.end = event_end
    event.location = event_location
    event.address = event_address
    event.description = event_description

    event.save()

    context = {'username': u_id,
               'title': event_title,
               'start': event_start,
               'end': event_end,
               'location': event_location,
               'address': event_address
               }

    return HttpResponse(json.dumps(context), content_type='application/json')


