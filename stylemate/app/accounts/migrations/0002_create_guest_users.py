from django.db import migrations
from django.contrib.auth.hashers import make_password

def create_guest_users(apps, schema_editor):
    User = apps.get_model('accounts', 'CustomUser')
    guests = [
        {
            "first_name": "GuestMale",
            "last_name": "User",
            "email": "guest_male@example.com",
            "password": "guestpassword",
            "gender": "male",
        },
        {
            "first_name": "GuestFemale",
            "last_name": "User",
            "email": "guest_female@example.com",
            "password": "guestpassword",
            "gender": "female",
        },
        {
            "first_name": "GuestMixed",
            "last_name": "User",
            "email": "guest_mixed@example.com",
            "password": "guestpassword",
            "gender": "other",
        }
    ]
    for guest in guests:
        if not User.objects.filter(email=guest["email"]).exists():
            user = User()
            # Use setattr to set values on the historical model
            setattr(user, "first_name", guest["first_name"])
            setattr(user, "last_name", guest["last_name"])
            setattr(user, "email", guest["email"])
            setattr(user, "gender", guest["gender"])
            user.password = make_password(guest["password"])
            user.save()

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_guest_users),
    ]
