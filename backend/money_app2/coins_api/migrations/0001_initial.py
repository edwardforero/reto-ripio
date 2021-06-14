# Generated by Django 3.2.4 on 2021-06-14 01:28

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Coin',
            fields=[
                ('id_coin', models.AutoField(primary_key=True, serialize=False)),
                ('coin_name', models.CharField(max_length=255, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('dolar_buys', models.DecimalField(decimal_places=4, default=1.0, max_digits=10)),
                ('dolar_sale', models.DecimalField(decimal_places=4, default=1.0, max_digits=10)),
                ('timestamp_created', models.DateTimeField(auto_now_add=True)),
                ('timestamp_modified', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 't_coins',
                'ordering': ['coin_name'],
            },
        ),
    ]