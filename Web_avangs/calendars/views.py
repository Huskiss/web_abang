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

    event_title = request.GET['e_title']
    event_start = request.GET['e_start']
    event_end = request.GET['e_end']
    event_location = request.GET['e_location']
    event_address = request.GET['e_address']
    u_id = request.session['loginObj']['u_name']

    Calendar.objects.create(username=u_id,
                            title=event_title,
                            start=event_start,
                            end=event_end,
                            location=event_location,
                            address=event_address,
                            )

    recent_data = Calendar.objects.filter(username=u_id).order_by('-id')
    print(recent_data[0])

    context = {'username': u_id,
               'title': event_title,
               'start': event_start,
               'end': event_end,
               'location': event_location,
               'address': event_address,
               'id': recent_data[0].id
               }

    return HttpResponse(json.dumps(context), content_type='application/json')

def load(request):
    u_id = request.session['loginObj']['u_name']
    calendar_list = Calendar.objects.filter(username=u_id)

    context = []
    for i in calendar_list:
        list = {'id': i.id,
                'title': i.title,
                'start': i.start,
                'end': i.end,
                'location': i.location,
                'address': i.address
                }
        context.append(list)

    return HttpResponse(json.dumps(context), content_type='application/json')

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
    event_id = request.GET['e_id']

    event = Calendar.objects.get(id=event_id)
    print(event.title)
    event.title = event_title
    event.start = event_start
    event.end = event_end
    event.location = event_location
    event.address = event_address

    event.save()

    context = {'username': u_id,
               'title': event_title,
               'start': event_start,
               'end': event_end,
               'location': event_location,
               'address': event_address,
               }

    return HttpResponse(json.dumps(context), content_type='application/json')


# 삭제 로직
def delete(request):
    u_id = request.session['loginObj']['u_name']

    event_id = request.GET['e_id']

    Calendar.objects.get(id=event_id).delete()
    print(event_id)

    context = {'username': u_id,
               }

    return HttpResponse(json.dumps(context), content_type='application/json')

# 지도화면 이동 로직
def map(request):
    location = request.POST['eventLocation']

    return  render(request, 'map화면 어플리케이션/map.html', {'location': location})

def resize(request):
    event_end = request.GET['e_end']
    event_id = request.GET['e_id']

    event = Calendar.objects.get(id=event_id)
    event.end = event_end

    event.save()

    context = {
               'end': event_end
               }

    return HttpResponse(json.dumps(context), content_type='application/json')

def drop(request):
    event_start = request.GET['e_start']
    event_end = request.GET['e_end']
    event_id = request.GET['e_id']

    event = Calendar.objects.get(id=event_id)
    event.start = event_start
    event.end = event_end

    event.save()

    context = {
        'start': event_start,
        'end': event_end
    }
    return HttpResponse(json.dumps(context), content_type='application/json')
