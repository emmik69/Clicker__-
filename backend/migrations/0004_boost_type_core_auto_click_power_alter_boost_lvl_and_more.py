# Generated by Django 5.0.2 on 2024-04-20 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_core_level'),
    ]

    operations = [
        migrations.AddField(
            model_name='boost',
            name='type',
            field=models.PositiveSmallIntegerField(choices=[(0, 'casual'), (1, 'auto')], default=0),
        ),
        migrations.AddField(
            model_name='core',
            name='auto_click_power',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='boost',
            name='lvl',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='core',
            name='level',
            field=models.IntegerField(default=1),
        ),
    ]
