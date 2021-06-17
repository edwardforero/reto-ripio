from users_api.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from utils.utils import validate_token
from utils.permissions import CheckApiKeyAuth, Authorization
from users_api.models import User
from coins_api.models import Coin
from .models import UserCoin, UserCoinsMovements
from .serializers import \
    CoinUserSerializer, UserCoinSerializerCreate, \
    UserCoinMovementsSerializer, UserCoinMovementsSerializerCreate


class UserCoinApiView(APIView):
    """ 
        API user coin relation
    """
    permission_classes = [CheckApiKeyAuth, Authorization]

    def get(self, request, format=None):
        """ get all user coin relation """
        user = validate_token(request.headers.get('Authorization'))
        if user is not None:
            all = request.GET.get('all', None)
            if all in [True, 'true', 'True'] and user.is_superuser is True:
                queryset = UserCoin.objects.all()
            
            else:
                queryset = UserCoin.objects.filter(user=user.id)

            serializer = CoinUserSerializer(queryset, many=True)
            return Response(serializer.data)
        else:
            msg = 'Faltan credenciales de autenticación.'
            return Response(
                {'error': msg},
                status=status.HTTP_400_BAD_REQUEST
            )

    def post(self, request):
        """ join user and coins """
        user = validate_token(request.headers.get('Authorization'))
        if user is None:
            msg = 'Faltan credenciales de autenticación.'
            return Response(
                {'error': msg},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializers_post = UserCoinSerializerCreate(data=request.data)
        if serializers_post.is_valid() is False:
            return Response(
                serializers_post.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            coin = Coin.objects.get(id_coin=serializers_post.validated_data.get('id_coin'))
            serializers_post.save(id_user=user, id_coin=coin)
            return Response(
                {'message': 'Ahora tienes la moneda '}, 
                status=200)

        except Exception as e:
            msg = e.args[0]
            if 'UNIQUE constraint failed: t_users_coins.id_coin, t_users_coins.id_user' in msg:
                msg = 'Ya cuentas con la moneda.'
            if 'Coin matching query does not exist.' in msg:
                msg = 'El id_coin es inválido'
            return Response(
                {
                    'error': msg
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )


class UserCoinMovementsApiView(APIView):
    """ 
        API user coin relation
    """
    permission_classes = [CheckApiKeyAuth, Authorization]

    def get(self, request, format=None):
        """ get all user coin movements """
        user = validate_token(request.headers.get('Authorization'))
        if user is None:
            msg = 'Faltan credenciales de autenticación.'
            return Response(
                {'error': msg},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        id_coin = request.GET.get('id_coin', None)
        if id_coin is None or id_coin == '':
            msg = 'Faltan el id_coin.'
            return Response(
                {'error': msg},
                status=status.HTTP_400_BAD_REQUEST
            )
        queryset = UserCoinsMovements.objects.filter(user=user.id, coin=id_coin)
        serializer = UserCoinMovementsSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        """ create user coin movement"""
        user = validate_token(request.headers.get('Authorization'))
        if user is None:
            msg = 'Faltan credenciales de autenticación.'
            return Response(
                {'error': msg},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializers_post = UserCoinMovementsSerializerCreate(data=request.data)
        if serializers_post.is_valid() is False:
            return Response(
                serializers_post.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        email_to = serializers_post.validated_data.get('email_to')
        if email_to == user.email:
            return Response(
                {'error': 'No puedes enviar a tu propio correo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        id_coin = serializers_post.validated_data.get('id_coin')
        amount = serializers_post.validated_data.get('amount')
        try:
            # gift
            if email_to is not None:
                user_to = User.objects.get(email=email_to)
                msg = 'Se han enviado {} {} a ' + email_to
            # buy
            else:
                user_to = user
                msg = "Se han recargado a tu cuenta {} {}"
            coin = Coin.objects.get(id_coin=id_coin)
            serializers_post.save(
                id_user=user, 
                id_coin=coin, 
                email_to=user_to)
            return Response(
                {'message': msg.format(
                    amount, 
                    coin.coin_name, 
                    email_to)
                }, 
                status=200)

        except Exception as e:
            msg = e.args[0]
            print(msg)
            if 'User matching query does not exist.' in msg:
                msg = 'El correo ' + email_to + ' no se encuentra registrado.'
            # if 'Coin matching query does not exist.' in msg:
            #     msg = 'No cuentas con la moneda seleccionada.'
            if 'CHECK constraint failed: amount_non_negative' in msg:
                msg = 'No cuentas con saldo suficiente.'
            if 'UNIQUE constraint failed: t_users_coins_movements.id_user, t_users_coins_movements.id_user_to, t_users_coins_movements.detail_movement, t_users_coins_movements.amount' in msg:
                msg = 'Ya realizaste ese movimiento'

            return Response(
                {
                    'error': msg
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )


