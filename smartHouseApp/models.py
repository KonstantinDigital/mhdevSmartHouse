from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class SmartHouseUser(User):
    class Meta:
        permissions = [("can_set_temperature", "Can set temperature"), ("can_set_light", "Can set light")]
