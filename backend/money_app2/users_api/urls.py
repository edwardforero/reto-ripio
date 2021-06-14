
from django.urls import path
from .views import UserApiView, UserLoginApiView

app_name = 'users'

urlpatterns = [
    path('', UserApiView.as_view(), name="user-crud"),
    path('login', UserLoginApiView.as_view(), name="user-login"),
    # path('<int:pk>/', HelloApiView.as_view(), name="user-detail"),
]