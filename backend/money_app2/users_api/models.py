from django.db import models
from django.contrib.auth.models \
    import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserProfileManager(BaseUserManager):

    def create_user(self, **extra_fields):
        if not extra_fields['email'] or extra_fields['email'] == '':
            raise ValueError("Email is required")
        extra_fields['email'] = self.normalize_email(extra_fields['email'])
        user = self.model( **extra_fields)
        user.set_password(extra_fields['password'])
        # user.save(using=self._db)
        user.save()
        return user


    def create_superuser(self, **extra_fields):
        # user = self.create_user(email=email, password=password,**extra_fields)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # user.save(using=self._db)
        # return user
        return self.create_user(**extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    model of users
    """
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    timestamp_created = models.DateTimeField(auto_now_add=True)
    timestamp_modified = models.DateTimeField(auto_now=True)

    objects = UserProfileManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = "t_users"

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_short_name(self):
        return self.first_name
        
    def __str__(self):
        return str(self.email)