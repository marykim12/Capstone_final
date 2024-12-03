from django.apps import AppConfig


class MyloansConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'myloans'


    def ready(self):
        import myloans.signals



