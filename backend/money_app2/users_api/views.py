from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


from utils.permissions import CheckApiKeyAuth
from .models import User
from .serializers import \
    UserSerializer, UserLoginSerializer, UserForeignSerializer


class UserApiView(APIView):
    """ 
        API users 
    """
    permission_classes = [CheckApiKeyAuth]

    def get(self, request, format=None):
        """ get all users """
        queryset = User.objects.all()
        serializer = UserForeignSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        """ create user or superuser"""
        serializers_post = UserSerializer(data=request.data)
        if serializers_post.is_valid():
            try:
                serializers_post.save()

            except Exception as e:
                msg = e.args[0]
                if 'UNIQUE constraint failed: t_users.email' in msg:
                    msg = 'El correo ingresado ya se encuentra registrado'
                return Response(
                    { 'error': msg }, 
                    status=status.HTTP_400_BAD_REQUEST,
                )

            email = serializers_post.validated_data.get('email')
            message = f'usuario creado {email}'
            return Response({'message': message}, status=200)
            
        else:
            return Response(
                serializers_post.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

class UserLoginApiView(APIView):
    """
        login users
    """
    permission_classes = [CheckApiKeyAuth]

    def post(self, request):
        """ Login user """
        serializers_post = UserLoginSerializer(data=request.data)
        if serializers_post.is_valid():
            email = serializers_post.validated_data.get('email')
            password = serializers_post.validated_data.get('password')
            user = authenticate(
                username=email, 
                password=password)
            if user is not None:
                token = Token.objects.get_or_create(user=user)
                print(token[0].key)
                return Response({ 
                    'message': 'usuario logueado correctamente',
                    'token': token[0].key }, 
                    status=200,
                )

            else:
                return Response(
                    {'error': 'Usuario o contraseña inválidos.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        else:
            return Response(
                serializers_post.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
