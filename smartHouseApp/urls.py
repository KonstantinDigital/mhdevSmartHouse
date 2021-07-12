from django.urls import path
from django.conf.urls import url
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    url('favicon.ico', RedirectView.as_view(url='/static/images/favicon.ico')),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('login/', LoginView.as_view(), name='login'),
    path('', views.index, name='index'),
]
