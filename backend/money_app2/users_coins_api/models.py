from os import curdir
from django.db import models
from users_api.models import User
from coins_api.models import Coin


class UserCoin(models.Model):
    """
    model of users coins
    """
    coin = models.ForeignKey(
        Coin, 
        on_delete=models.PROTECT, 
        db_column='id_coin')
    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        db_column='id_user')
    is_active = models.BooleanField(default=True)
    amount = models.DecimalField(
        default=0, 
        max_digits=14, 
        decimal_places=4,)
    timestamp_created = models.DateTimeField(auto_now_add=True)
    timestamp_modified = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['coin_name', 'created_by']

    class Meta:
        db_table = "t_users_coins"
        ordering = ['timestamp_created']
        unique_together = ('coin', 'user',)
        constraints = [
            models.CheckConstraint(check=models.Q(amount__gte='0'), name='amount_non_negative'),
        ]

    def get_full_name(self):
        return '{} - {}, cantidad: {}'.\
            format(str(self.coin), str(self.user), str(self.amount))

    def get_short_name(self):
        return '{} - {}, cantidad: {}'.\
            format(str(self.coin), str(self.user), str(self.amount))

    def __str__(self):
        return '{} - {}, cantidad: {}'.\
            format(str(self.coin), str(self.user), str(self.amount))

class UserCoinsMovements(models.Model):
    """
    model of users coins movements
    """
    id_user_coin_movements = models.AutoField(primary_key=True)
    coin = models.ForeignKey(
        Coin, 
        on_delete=models.PROTECT,
        db_column='id_coin')
    user = models.ForeignKey(
        User,
        related_name='%(class)s_requests_created',
        on_delete=models.PROTECT,
        db_column='id_user')
    user_to = models.ForeignKey(
        User,
        related_name='id_user_to',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        db_column='id_user_to')
    user_from = models.ForeignKey(
        User,
        related_name='id_user_from',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        db_column='id_user_from')
    detail_movement = models.TextField()
    amount = models.DecimalField(
        default=0, 
        max_digits=14, 
        decimal_places=4,)
    timestamp_created = models.DateTimeField(auto_now_add=True)
    timestamp_modified = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['user', 'user_to', 'amount']

    class Meta:
        db_table = "t_users_coins_movements"
        ordering = ['timestamp_created']
        unique_together = ('user', 'user_to', 'detail_movement', 'amount')

    def get_full_name(self):
        msg = (' enviado a: ' + str(self.user_to)) \
            if self.user_to is not None else ''
        msg = (' recibido de: ' + str(self.user_from)) \
            if self.user_from is not None else msg
        return '{} - {}, cantidad: {} {}'.\
            format(str(self.coin), str(self.user), str(self.amount), msg)

    def get_short_name(self):
        msg = (' enviado a: ' + str(self.user_to)) \
            if self.user_to is not None else ''
        msg = (' recibido de: ' + str(self.user_from)) \
            if self.user_from is not None else msg
        return '{} - {}, cantidad: {} {}'.\
            format(str(self.coin), str(self.user), str(self.amount), msg)

    def __str__(self):
        msg = (' enviado a: ' + str(self.user_to)) \
            if self.user_to is not None else ''
        msg = (' recibido de: ' + str(self.user_from)) \
            if self.user_from is not None else msg
        return '{} - {}, cantidad: {} {}'.\
            format(str(self.coin), str(self.user), str(self.amount), msg)
