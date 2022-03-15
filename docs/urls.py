from django.urls import path
from . import views

urlpatterns = [
    path('', views.MainView.as_view(), name='main-view'),
    path('upload/', views.upload_document, name="upload-document")
]
