from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ServiceRecord
from .serializers import ServiceRecordSerializer
from rest_framework import viewsets
import re
from django.http import JsonResponse
from .models import SystemSetting
from rest_framework import viewsets, permissions

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ServiceRecord
import re

@csrf_exempt
def whatsapp_webhook(request):
    # Support both GET (links) and POST data streams
    incoming_msg = request.POST.get('Body') or request.GET.get('Body', '')
    from_number = request.POST.get('From') or request.GET.get('From', '')
    
    incoming_msg = incoming_msg.strip()
    from_number = from_number.replace('whatsapp:', '').strip()

    # FIXED: Using 'phoneNumber' instead of 'phone_number' to match your database columns
    try:
        record = ServiceRecord.objects.filter(phoneNumber__contains=from_number).last()
        if not record:
            return HttpResponse("Record match execution failed: Phone number entry not found.", status=404)
    except Exception as e:
        return HttpResponse(f"Database error execution context: {str(e)}", status=500)

    # State Matrix Management
    if incoming_msg.lower() == 'accept':
        record.status = 'Confirmed'
        record.save()
        
        # FIXED: Removed the hardcoded ngrok link and replaced with relative paths (/) 
        # This forces the browser to automatically stick to your current working ngrok domain
        output_ui = (
            f"<h1>Status Confirmed!</h1>"
            f"<p>Thank you {record.customerName}. Your vehicle setup status is now confirmed.</p>"
            f"<p>Please click on your preferred scheduling option below to choose a time slot:</p>"
            f"<ul>"
            f"<li><a href='/api/whatsapp-webhook/?Body=1&From={from_number}' style='font-size:18px; line-height:2;'>Option 1: 10:00 AM</a></li>"
            f"<li><a href='/api/whatsapp-webhook/?Body=2&From={from_number}' style='font-size:18px; line-height:2;'>Option 2: 02:00 PM</a></li>"
            f"<li><a href='/api/whatsapp-webhook/?Body=3&From={from_number}' style='font-size:18px; line-height:2;'>Option 3: 05:00 PM</a></li>"
            f"</ul>"
        )
        return HttpResponse(output_ui)

    elif incoming_msg in ['1', '2', '3']:
        time_slots = {'1': '10:00 AM', '2': '02:00 PM', '3': '05:00 PM'}
        # FIXED: appointment_time matches your database schema list
        record.appointment_time = time_slots[incoming_msg]
        record.save()
        return HttpResponse(f"<h1>Appointment Booked!</h1><p>Your timeline slot is successfully allocated at {record.appointment_time}.</p>")

    elif incoming_msg.lower() == 'delay':
        record.status = 'Delayed'
        record.save()
        
        # Simple dynamic web form interface for fallback entry redirection
        input_form_ui = (
            f"<h1>Reschedule Service Request</h1>"
            f"<form action='/api/whatsapp-webhook/' method='GET'>"
            f"<input type='hidden' name='From' value='{from_number}' />"
            f"<label>Pick New Target Date:</label><br/>"
            f"<input type='date' name='Body' required /><br/><br/>"
            f"<button type='submit'>Reschedule Now</button>"
            f"</form>"
        )
        return HttpResponse(input_form_ui)

    elif re.match(r'^\d{4}-\d{2}-\d{2}$', incoming_msg):
        # FIXED: calculatedDate or reminderDate handling based on your schema choices
        # Your error options showed 'calculatedDate', so we use it to match your columns perfectly
        record.calculatedDate = incoming_msg
        record.save()
        return HttpResponse(f"<h1>Reschedule Success!</h1><p>Your service target timeline moved to {incoming_msg}.</p>")

    return HttpResponse("Invalid Action Sequence Triggers.", status=400)



class ServiceRecordViewSet(viewsets.ModelViewSet):
    queryset = ServiceRecord.objects.all()
    serializer_class = ServiceRecordSerializer
    permission_classes = [permissions.AllowAny]
    queryset = ServiceRecord.objects.all()
    serializer_class = ServiceRecordSerializer
    
def get_system_settings(request):
    try:
        setting = SystemSetting.objects.get(key='admin_whatsapp_number')
        return JsonResponse({'admin_whatsapp_number': setting.value})
    except SystemSetting.DoesNotExist:
        # Fallback value if database row is missing
        return JsonResponse({'admin_whatsapp_number': '+916354071535'})