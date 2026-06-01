from rest_framework import viewsets, permissions
from rest_framework.response import Response # इसे जोड़ें
from .models import ServiceRecord
from .serializers import ServiceRecordSerializer

class ServiceRecordViewSet(viewsets.ModelViewSet):
    queryset = ServiceRecord.objects.all()
    serializer_class = ServiceRecordSerializer
    permission_classes = [permissions.AllowAny]

    # यह हिस्सा हमें टर्मिनल में एरर दिखाएगा
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("--- VALIDATION ERROR ---")
            print(serializer.errors) # टर्मिनल में चेक करें क्या एरर है
            return Response(serializer.errors, status=400)
        return super().create(request, *args, **kwargs)
