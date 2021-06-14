from coins_api.models import Coin
from coins_api.serializers import CoinSerializer
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

from users_api.models import User

# user = User(email='edward.efa@gmail.com')
user = User.objects.get(email='test@test.com')

coin = Coin(coin_name='Dolares', created_by=user)
coin.save()

serializer = CoinSerializer(coin)
serializer.data

content = JSONRenderer().render(serializer.data)
content


# Deserialization
import io

stream = io.BytesIO(content)
data = JSONParser().parse(stream)

# token
from rest_framework.authtoken.models import Token
from users_api.models import User

user = User.objects.get(email='test@test.com')
# token = Token.objects.create(user=user)
token = Token.objects.get_or_create(user=user)
print(token.key)
# ffa3a79e9314d1700d8e8fb243cb02acded286de
token = Token.objects.get(key='ffa3a79e9314d1700d8e8fb243cb02acded286de')
token.user