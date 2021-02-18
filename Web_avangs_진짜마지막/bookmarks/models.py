from django.db import models

class Post(models.Model):
    username = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    address1 = models.CharField(max_length=200)
    call = models.CharField(max_length=200)
    category = models.CharField('카테고리', max_length=100)

    def __str__(self):
        return self.category

