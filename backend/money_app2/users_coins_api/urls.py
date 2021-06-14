
from django.urls import path
from .views import UserCoinApiView, UserCoinMovementsApiView

app_name = 'users-coins'

urlpatterns = [
    path('', UserCoinApiView.as_view(), name="user-coins-crud"),
    path('movements', UserCoinMovementsApiView.as_view(), name="user-coins-crud"),
]