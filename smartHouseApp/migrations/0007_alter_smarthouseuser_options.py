# Generated by Django 3.2.5 on 2021-07-14 08:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('smartHouseApp', '0006_alter_smarthouseuser_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='smarthouseuser',
            options={'permissions': [('can_set_temperature', 'Can set temperature'), ('can_set_light', 'Can set light')]},
        ),
    ]
