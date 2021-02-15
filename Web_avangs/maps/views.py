from django.shortcuts import render
from django.http import HttpResponse

import json

def maps(request):

    return render(request, 'maps/kakaomap.html', {'page_title': request.session['loginObj']['u_name']})


def maps_process(request):

    title = request.GET['title']
    address1 = request.GET['address1']
    address2 = request.GET['address2']
    call = request.GET['call']
    date1 = request.GET['date1']
    date2 = request.GET['date2']
    content = request.GET['content']
    position_y = request.GET['position_y']
    position_x = request.GET['position_x']
    user_id = request.session['loginObj']['u_name']


    # Map.objects.create(username=user_id,
    #                     title=title,
    #                     address1=address1,
    #                     address2=address2,
    #                     call=call,
    #                     date1=date1,
    #                     date2=date2,
    #                     content=content)

    context = {'username': user_id,
                'title' : title,
                'address1': address1,
                'address2': address2,
                'call': call,
                'date': date1,
                'date2': date2,
                'content': content
    }

    return HttpResponse(json.dumps(context), content_type='application/json')


