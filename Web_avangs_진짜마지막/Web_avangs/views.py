from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

def main(request):
    return render(request, 'main.html',
                  {'page_title': request.session['loginObj']['u_name']})
