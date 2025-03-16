from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username must be set")
        if not email:
            raise ValueError("An email address is required")
        
        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            **extra_fields
        )
        user.set_password(password)  # Hashes the password and stores it in password_hash column.
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    # Maps the password field to the "password_hash" column in the database.
    password = models.CharField(max_length=255, db_column="password_hash")
    
    # New profile photo field (optional)
    profile_photo_url = models.CharField(max_length=255, null=True, blank=True)
    
    # Standard Django fields for managing user status.
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    # Note: AbstractBaseUser already provides a last_login field.

    # Gender fields with fixed choices.
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('non-binary', 'Non-binary'),
        ('other', 'Other'),
    )
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, null=False, blank=False)
    gender_other = models.CharField(max_length=50, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email','gender']

    class Meta:
        db_table = 'Users'  # Tells Django to use the existing "Users" table.
        managed = False    # Prevents Django from altering the existing table structure.

    def __str__(self):
        return self.username
