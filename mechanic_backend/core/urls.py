from rest_framework import viewsets, permissions # permissions इम्पोर्ट करें
from .models import ServiceRecord
from .serializers import ServiceRecordSerializer

class ServiceRecordViewSet(viewsets.ModelViewSet):
    queryset = ServiceRecord.objects.all()
    serializer_class = ServiceRecordSerializer
    permission_classes = [permissions.AllowAny] 
