
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users_api.urls')),
    path('coins/', include('coins_api.urls')),
    path('users-coins/', include('users_coins_api.urls')),
]
