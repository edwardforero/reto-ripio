import os
from django.core.management import BaseCommand
from django.db import connection

# from applications.cardo.utils import perform_query
from money.settings import BASE_DIR


class Command(BaseCommand):
    help = 'Loads all database scripts'

    def handle(self, **options):
        # db_scripts_path = os.path.join(BASE_DIR / 'db.sqlite3')
        utils_path = os.path.join(BASE_DIR, 'utils/utils.sql')
        with open(utils_path, mode='r') as f:
            sql_query = f.read()
            querys = sql_query.split(';\n-- end')
            for x in range(len(querys)):
                if len(querys[x]) > 0:
                    print(querys[x])
                    with connection.cursor() as cursor:
                        cursor.execute(querys[x])