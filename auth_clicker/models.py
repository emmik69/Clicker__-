from django.db import models
from django.contrib.auth.models import User


class Core(models.Model):
  user = models.OneToOneField(User, null=False, on_delete=models.CASCADE)
  coins = models.IntegerField(default=0)
  click_power = models.IntegerField(default=1)


class UserData(models.Model):
  username = models.CharField(max_length=70)
  password = models.CharField(max_length=100)