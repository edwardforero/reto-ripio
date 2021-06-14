from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from utils.utils import validate_token
from utils.permissions import CheckApiKeyAuth, AuthorizationWithoutGet
from .models import Coin
from .serializers import CoinSerializer


class CoinApiView(APIView):
    """ 
        API coins 
    """
    permission_classes = [CheckApiKeyAuth, AuthorizationWithoutGet]

    def get(self, request, format=None):
        """ get all coins """
        queryset = Coin.objects.all()
        serializer = CoinSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        """ create coin"""
        user = validate_token(request.headers.get('Authorization'))
        if user is not None and user.is_superuser is True:
            serializers_post = CoinSerializer(data=request.data)

            if serializers_post.is_valid():
                coin_name = serializers_post.validated_data.get('coin_name')
                try:
                    serializers_post.save(created_by=user)
                    return Response(
                        {'message': 'Moneda ' + coin_name + ' creada.'}, 
                        status=200)

                except Exception as e:
                    msg = e.args[0]
                    if 'UNIQUE constraint failed: t_coins.coin_name' in msg:
                        msg = 'La moneda ' + coin_name + ' ya se encuentra registrada'
                    return Response(
                        {
                            'error': msg
                        }, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

            else:
                return Response(
                    serializers_post.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            msg = 'Faltan credenciales de autenticación.'\
                    if user is None else 'Debes ser super usuario'
            return Response(
                {'error': msg},
                status=status.HTTP_400_BAD_REQUEST
            )
