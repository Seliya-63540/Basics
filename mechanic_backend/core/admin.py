from django.contrib import admin
from .models import ServiceRecord
from django.contrib import admin
from .models import SystemSetting

admin.site.register(SystemSetting)
admin.site.register(ServiceRecord)


# Register your models here.
