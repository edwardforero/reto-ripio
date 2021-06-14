from rest_framework.authtoken.models import Token
from users_api.models import User


def validate_token(token):
    try:
        new_token = token.split()[1]
        token = Token.objects.get(key=new_token)
        return token.user
    except Exception as e:
        print(e)
        return None
