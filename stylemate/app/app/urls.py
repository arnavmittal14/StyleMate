from django.contrib import admin
from django.urls import path
from . import views
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.homepage, name="homepage"),
    path("about/", views.about, name="about"),
    path("api/login/", views.api_login, name="api_login"),
    path("api/register/", views.api_register, name="api_register"),
    path('api/add_to_closet/', views.add_to_closet, name='add_to_closet'),
    path("api/ai/", include("ai_processor.urls")),
]