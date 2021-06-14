from django.conf import settings

from rest_framework.permissions import BasePermission

class CheckApiKeyAuth(BasePermission):
    def has_permission(self, request, view):
        api_key_secret = request.META.get('HTTP_X_API_KEY')
        return api_key_secret == settings.API_KEY_SECRET

class AuthorizationWithoutGet(BasePermission):

    def has_permission(self, request, view):
        if request.method in 'GET':
            return True
        authorization = request.headers.get('Authorization', '')
        if 'Token' not in authorization:
            return False
        authorization = authorization.split()
        return len(authorization) == 2

class Authorization(BasePermission):


    def has_permission(self, request, view):
        authorization = request.headers.get('Authorization', '')
        if 'Token' not in authorization:
            return False
        authorization = authorization.split()
        return len(authorization) == 2

