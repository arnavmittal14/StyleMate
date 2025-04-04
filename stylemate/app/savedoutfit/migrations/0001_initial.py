# Generated by Django 4.2.20 on 2025-03-21 02:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='OutfitSet',
            fields=[
                ('outfit_id', models.AutoField(db_column='outfit_id', primary_key=True, serialize=False)),
                ('outfit_name', models.CharField(db_column='outfit_name', max_length=100)),
                ('current_weather', models.CharField(blank=True, db_column='current_weather', max_length=100, null=True)),
            ],
            options={
                'db_table': 'OutfitSets',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='SavedOutfit',
            fields=[
                ('saved_outfit_id', models.AutoField(db_column='saved_outfit_id', primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'SavedOutfits',
                'managed': False,
            },
        ),
    ]
