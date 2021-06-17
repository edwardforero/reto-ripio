from django.db.models.query import QuerySet
from rest_framework import serializers
from .models import UserCoin, UserCoinsMovements
from users_api.serializers import UserForeignSerializer
from coins_api.serializers import CoinSerializerForeign


class CoinUserSerializer(serializers.Serializer):

    id_user_coin_movements = serializers.IntegerField(read_only=True)
    coin = CoinSerializerForeign()
    user = UserForeignSerializer()
    amount = serializers.DecimalField(
        min_value=0.0001,
        max_digits=10, 
        decimal_places=4, 
        required=True)
    timestamp_created = serializers.DateTimeField(read_only=True)
    timestamp_modified = serializers.DateTimeField(read_only=True)


class UserCoinSerializerCreate(serializers.Serializer):

    id_user_coin_movements = serializers.IntegerField(read_only=True)
    id_coin = serializers.IntegerField()
    amount = serializers.DecimalField(
        min_value=0.0001,
        max_digits=10, 
        decimal_places=4, 
        required=True)
    timestamp_created = serializers.DateTimeField(read_only=True)
    timestamp_modified = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        """
            Create and return a new user coin relation
        """
        validated_data['coin'] = validated_data.pop('id_coin', None)
        validated_data['user'] = validated_data.pop('id_user', None)
        return UserCoin.objects.create(**validated_data)


class UserCoinMovementsSerializer(serializers.Serializer):

    id_user_coin_movements = serializers.IntegerField(read_only=True)
    coin = CoinSerializerForeign()
    user = UserForeignSerializer()
    user_to = UserForeignSerializer() 
    #  serializers.EmailField(
    #     max_length=100, 
    #     required=True)
    detail_movement = serializers.CharField()
    amount = serializers.DecimalField(
        min_value=0.0001,
        max_digits=10, 
        decimal_places=4, 
        required=True)
    timestamp_created = serializers.DateTimeField(read_only=True)
    timestamp_modified = serializers.DateTimeField(read_only=True)


class UserCoinMovementsSerializerCreate(serializers.Serializer):

    id_user_coin_movements = serializers.IntegerField(read_only=True)
    id_coin = serializers.IntegerField()
    email_to = serializers.EmailField(
        max_length=100, 
        required=False)
    amount = serializers.DecimalField(
        min_value=0.0001,
        max_digits=10, 
        decimal_places=4, 
        required=True)
    detail_movement = serializers.CharField(
        max_length=50, 
        min_length=1, 
        trim_whitespace=True, 
        required=True)
    timestamp_created = serializers.DateTimeField(read_only=True)
    timestamp_modified = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        """
            Create and return a new user coin relation
        """
        validated_data['coin'] = validated_data.pop('id_coin', None)
        validated_data['user'] = validated_data.pop('id_user', None)
        validated_data['user_to'] = validated_data.pop('email_to', None)
        return UserCoinsMovements.objects.create(**validated_data)


