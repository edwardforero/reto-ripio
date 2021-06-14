# find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
# find . -path "*/migrations/*.pyc"  -delete
# rm db.sqlite3
python manage.py makemigrations
python manage.py migrate

python manage.py shell <<EOF
from utils.load_database_scripts import Command
command = Command()
command.handle()
EOF

# python manage.py createsuperuser --email=test@test.com --first_name='pepito' --last_name='test'

