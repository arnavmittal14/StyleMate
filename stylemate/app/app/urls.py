from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from ai_processor.views import generate_outfit

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
    path("api/current_user/", views.current_user, name="current_user"),
    path("api/guest_login/", views.guest_login, name="guest_login"),
    path("api/profile_photo/<int:user_id>/", views.serve_profile_photo, name="serve_profile_photo"),
    path("api/update_user/", views.update_user, name="update_user"),
    path("api/serve_clothing_item/<int:item_id>/", views.serve_clothing_item, name="serve_clothing_item"),
    path("api/generate-outfit/", generate_outfit, name="generate-outfit"),



]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

