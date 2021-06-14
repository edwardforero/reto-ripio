from rest_framework import serializers
from .models import Coin


class CoinSerializer(serializers.Serializer):

    id_coin = serializers.IntegerField(read_only=True)
    coin_name = serializers.CharField(max_length=255, required=True)
    is_active = serializers.BooleanField(required=False)
    dolar_buys = serializers.DecimalField(
        max_digits=10, 
        decimal_places=4, 
        required=True)
    dolar_sale = serializers.DecimalField(
        max_digits=10, 
        decimal_places=4, 
        required=True)
    timestamp_created = serializers.DateTimeField(read_only=True)
    timestamp_modified = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        """
            Create and return a new coin
        """
        return Coin.objects.create(**validated_data)


class CoinSerializerForeign(serializers.Serializer):

    id_coin = serializers.IntegerField()
    coin_name = serializers.CharField(max_length=255, read_only=True)
    dolar_buys = serializers.DecimalField(
        max_digits=10, 
        decimal_places=4,
        read_only=True)
    dolar_sale = serializers.DecimalField(
        max_digits=10, 
        decimal_places=4,
        read_only=True)

