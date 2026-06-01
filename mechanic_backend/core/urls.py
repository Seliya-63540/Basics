from rest_framework import viewsets, permissions # permissions इम्पोर्ट करें
from .models import ServiceRecord
from .serializers import ServiceRecordSerializer

class ServiceRecordViewSet(viewsets.ModelViewSet):
    queryset = ServiceRecord.objects.all()
    serializer_class = ServiceRecordSerializer
    
    # यह लाइन पासवर्ड की ज़रूरत को खत्म कर देगी (AllowAny)
    permission_classes = [permissions.AllowAny] 
