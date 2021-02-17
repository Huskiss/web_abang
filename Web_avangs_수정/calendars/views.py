from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from calendars.models import Calendar

import json

def calendar(request):
    return render(request, 'calendars/calendar.html', {'page_title': request.session['loginObj']['u_name']})

def save(request):

    event_title = request.GET['e_title']
    event_start = request.GET['e_start']
    event_end = request.GET['e_end']
    event_location = request.GET['e_location']
    event_address = request.GET['e_address']
    event_color = request.GET['e_color']
    u_id = request.session['loginObj']['u_name']

    Calendar.objects.create(username=u_id,
                            title=event_title,
                            start=event_start,
                            end=event_end,
                            location=event_location,
                            address=event_address,
                            color=event_color
                            )

    recent_data = Calendar.objects.filter(username=u_id).order_by('-id')

    context = {'username': u_id,
               'title': event_title,
               'start': event_start,
               'end': event_end,
               'location': event_location,
               'address': event_address,
               'color': event_color,
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
                'address': i.address,
                'color': i.color
                }
        context.append(list)

    return HttpResponse(json.dumps(context), content_type='application/json')

def fix(request):
    u_id = request.session['loginObj']['u_name']
    event_title = request.GET['e_title']
    event_start = request.GET['e_start']
    event_end = request.GET['e_end']
    event_location = request.GET['e_location']
    event_address = request.GET['e_address']
    event_color = request.GET['e_color']
    event_id = request.GET['e_id']

    event = Calendar.objects.get(id=event_id)

    event.title = event_title
    event.start = event_start
    event.end = event_end
    event.location = event_location
    event.address = event_address
    event.color = event_color

    event.save()

    context = {'username': u_id,
               'title': event_title,
               'start': event_start,
               'end': event_end,
               'location': event_location,
               'address': event_address,
               'color': event_color
               }

    return HttpResponse(json.dumps(context), content_type='application/json')


# 삭제 로직
def delete(request):
    u_id = request.session['loginObj']['u_name']

    event_id = request.GET['e_id']

    Calendar.objects.get(id=event_id).delete()

    context = {'username': u_id,
               }

    return HttpResponse(json.dumps(context), content_type='application/json')

# 지도화면 이동 로직
def map(request):
    location = request.POST['eventLocation']
    schedule = request.POST['eventName']
    start = request.POST['eventStartDate']
    end = request.POST['eventEndDate']
    context = {
        'location': location,
        'schedule': schedule,
        'start': start,
        'end': end
    }
    return  render(request, 'maps/kakaomap.html', context)

# 캘린더 바 사이즈 조절 시, 데이터베이스 날짜 수정
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

# 캘린더 바 이동 시, 데이터베이스 날짜 수정
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

def fix_map(request):
    location = request.POST['fixEventLocation']
    schedule = request.POST['fixEventName']
    start = request.POST['fixStartDate']
    end = request.POST['fixEndDate']
    eventId = request.POST['fixEventId']

    context = {
        'location': location,
        'schedule': schedule,
        'start': start,
        'end': end,
        'id': eventId
    }
    return  render(request, 'maps/kakaomap.html', context)