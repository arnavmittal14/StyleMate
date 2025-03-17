from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, first_name, last_name, email, password=None, **extra_fields):
        if not first_name:
            raise ValueError("The first name must be set")
        if not email:
            raise ValueError("An email address is required")
        
        email = self.normalize_email(email)
        user = self.model(
            first_name=first_name,
            last_name=last_name,
            email=email,
            **extra_fields
        )
        user.set_password(password)  # Hashes the password and stores it in password_hash column.
        user.save(using=self._db)
        return user

    def create_superuser(self, first_name, last_name, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(first_name, last_name, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50, unique=True)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True)
    # Maps the password field to the "password_hash" column in the database.
    password = models.CharField(max_length=255, db_column="password_hash")
    
    # Optional profile photo field.
    profile_photo_data = models.BinaryField(null=True, blank=True)
    
    # Standard Django user status fields.
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    # Note: AbstractBaseUser provides last_login.
    
    # Gender fields.
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('non-binary', 'Non-binary'),
        ('other', 'Other'),
    )
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, null=False, blank=False)
    gender_other = models.CharField(max_length=50, null=True, blank=True)

    objects = CustomUserManager()

    # Set USERNAME_FIELD to email for authentication.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'gender']

    class Meta:
        db_table = 'Users'  # Uses the existing "Users" table.
        managed = True    # Prevents Django from altering the existing table structure.

    def __str__(self):
        return self.email
    
    
