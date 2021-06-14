# Generated by Django 3.2.4 on 2021-06-14 01:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('coins_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserCoin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('amount', models.DecimalField(decimal_places=4, default=0, max_digits=14)),
                ('timestamp_created', models.DateTimeField(auto_now_add=True)),
                ('timestamp_modified', models.DateTimeField(auto_now=True)),
                ('coin', models.ForeignKey(db_column='id_coin', on_delete=django.db.models.deletion.PROTECT, to='coins_api.coin')),
                ('user', models.ForeignKey(db_column='id_user', on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 't_users_coins',
                'ordering': ['timestamp_created'],
            },
        ),
        migrations.CreateModel(
            name='UserCoinsMovements',
            fields=[
                ('id_user_coin_movements', models.AutoField(primary_key=True, serialize=False)),
                ('detail_movement', models.TextField()),
                ('amount', models.DecimalField(decimal_places=4, default=0, max_digits=14)),
                ('timestamp_created', models.DateTimeField(auto_now_add=True)),
                ('timestamp_modified', models.DateTimeField(auto_now=True)),
                ('coin', models.ForeignKey(db_column='id_coin', on_delete=django.db.models.deletion.PROTECT, to='coins_api.coin')),
                ('user', models.ForeignKey(db_column='id_user', on_delete=django.db.models.deletion.PROTECT, related_name='usercoinsmovements_requests_created', to=settings.AUTH_USER_MODEL)),
                ('user_from', models.ForeignKey(blank=True, db_column='id_user_from', null=True, on_delete=django.db.models.deletion.PROTECT, related_name='id_user_from', to=settings.AUTH_USER_MODEL)),
                ('user_to', models.ForeignKey(blank=True, db_column='id_user_to', null=True, on_delete=django.db.models.deletion.PROTECT, related_name='id_user_to', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 't_users_coins_movements',
                'ordering': ['timestamp_created'],
                'unique_together': {('user', 'user_to', 'detail_movement', 'amount')},
            },
        ),
        migrations.AddConstraint(
            model_name='usercoin',
            constraint=models.CheckConstraint(check=models.Q(('amount__gte', '0')), name='amount_non_negative'),
        ),
        migrations.AlterUniqueTogether(
            name='usercoin',
            unique_together={('coin', 'user')},
        ),
    ]
