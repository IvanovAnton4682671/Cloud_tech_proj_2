"""
URL configuration for Neuro_Service project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('authorization', authorization, name='authorization'),
    path('registration', registration, name='registration'),
    path('user_message_text', user_message_text, name='user_message_text'),
    path('user_message_img', user_message_img, name='user_message_img'),
    path('user_message_audio', user_message_audio, name='user_message_audio'),
]
