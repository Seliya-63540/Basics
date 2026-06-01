from django.db import models

class ServiceRecord(models.Model):
    customerName = models.CharField(max_length=200)
    phoneNumber = models.CharField(max_length=15)
    vehicleNumber = models.CharField(max_length=50)
    serviceDate = models.DateField()
    calculatedDate = models.DateField()
    

    appointment_time = models.CharField(max_length=50, blank=True, null=True) 

    status = models.CharField(max_length=20, default='Pending')

    def __str__(self):
        return f"{self.customerName} - {self.vehicleNumber}"
