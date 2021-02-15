from django.db import models

class Map(models.Model):
    username = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    address1 = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200)
    call = models.CharField(max_length=200)
    date1 = models.CharField(max_length=200)
    date2 = models.CharField(max_length=200)
    content = models.CharField(max_length=200)

    def __str__(self):
        return self.content