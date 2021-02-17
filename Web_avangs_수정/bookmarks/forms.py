from django import forms
from bookmarks.models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['username',
                  'title',
                  'address1',
                  'call',
                  'category']
