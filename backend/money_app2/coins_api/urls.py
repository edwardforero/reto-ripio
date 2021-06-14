
from django.urls import path
from .views import CoinApiView

app_name = 'coins'

urlpatterns = [
    path('', CoinApiView.as_view(), name="coins-crud"),
]