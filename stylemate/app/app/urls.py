from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.homepage, name="homepage"),
    path("about/", views.about, name="about"),
    path("api/login/", views.api_login, name="api_login"),
    path("api/register/", views.api_register, name="api_register"),
    path("api/add_to_closet/", views.add_to_closet, name="add_to_closet"),
    path("api/add_saved_outfit/", views.add_saved_outfit, name="add_saved_outfit"),
    path("api/get_saved_outfits/", views.get_saved_outfits, name="get_saved_outfits"),
    path("api/get_closet/", views.get_closet, name="get_closet"),
    path("api/get_users/", views.get_users, name="get_users"),
    path("api/upload_and_process_photo/", views.upload_and_process_photo, name="upload_and_process_photo"),
    path("api/ai/", include("ai_processor.urls")),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

