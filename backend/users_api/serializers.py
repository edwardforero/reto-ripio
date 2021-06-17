from rest_framework import serializers
from .models import User


class UserForeignSerializer(serializers.Serializer):

    email = serializers.EmailField(
        max_length=100, 
        required=True)
    first_name = serializers.CharField(
        min_length=3, 
        max_length=80)
    last_name = serializers.CharField(
        min_length=3, 
        max_length=80)
    is_superuser = serializers.BooleanField(default=False)


class UserSerializer(serializers.Serializer):

    email = serializers.EmailField(
        max_length=100, 
        required=True)
    password = serializers.CharField(
        min_length=6, 
        max_length=255, 
        required=True)
    first_name = serializers.CharField(
        min_length=3, 
        max_length=80)
    last_name = serializers.CharField(
        min_length=3, 
        max_length=80)
    is_staff = serializers.BooleanField(default=False)
    is_superuser = serializers.BooleanField(default=False)

    def create(self, validated_data):
        """
            Create and return a new coin
        """
        if validated_data.get('is_superuser', False) == True:
            user = User.objects.create_superuser(**validated_data)
        else:
            user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):

    email = serializers.EmailField(
        max_length=100, 
        required=True)
    password = serializers.CharField(
        min_length=6, 
        max_length=255, 
        required=True)

