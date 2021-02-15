from django.db import models

class Calendar(models.Model):
    username = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    start = models.CharField(max_length=50)
    end = models.CharField(max_length=50)
    location = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    description = models.CharField(max_length=200)

    def __str__(self):
        return self.title
