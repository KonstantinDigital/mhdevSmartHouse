from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import smartHouseApp.my_modbus


# Create your views here.
@login_required(login_url="/login/")
def index(request):
    return render(request, "index.html")
