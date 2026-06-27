from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import ServiceRecordViewSet, whatsapp_webhook # दोनों इम्पोर्ट होने चाहिए

router = DefaultRouter()
router.register(r'services', ServiceRecordViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)), # यह आपके /api/services/ को संभालेगा
    path('api/whatsapp-webhook/', whatsapp_webhook), # यह व्हाट्सएप्प के Accept/Delay को संभालेगा
]
