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
    path('getNewData', views.get_data, name='new_data'),
    path('writeSwitchClick', views.write_switches, name='light_state'),
    path('writeOwmClick', views.sunset_sunrise_owm, name='owm_state'),
    path('writeSheduleClick', views.light_shedule_mode, name='shedule_mode'),
    path('writeConditionerSetPoint', views.conditioner_sp_mode, name='set_point_mode')
]
