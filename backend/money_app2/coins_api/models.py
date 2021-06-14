from django.db import models


class Coin(models.Model):
    """
    model of coins
    """
    id_coin = models.AutoField(primary_key=True)
    coin_name = models.CharField(max_length=255, unique=True)
    created_by = models.ForeignKey(
                    'users_api.User',
                    # settings.AUTH_USER_MODEL,
                    on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)
    dolar_buys = models.DecimalField(
        max_digits=10, 
        decimal_places=4, 
        default=1.0)
    dolar_sale = models.DecimalField(
        max_digits=10, 
        decimal_places=4, 
        default=1.0)
    timestamp_created = models.DateTimeField(auto_now_add=True)
    timestamp_modified = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['coin_name', 'created_by']

    class Meta:
        db_table = "t_coins"
        ordering = ['coin_name']

    def get_full_name(self):
        return '({id_coin}) - {self.coin_name}. \
            Compra: {self.dolar_buys}. Venta: {self.dolar_sale}'

    def get_short_name(self):
        return self.coin_name

    def __str__(self):
        return self.coin_name
