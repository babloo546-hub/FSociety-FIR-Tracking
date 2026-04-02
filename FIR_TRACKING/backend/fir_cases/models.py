import uuid
from django.db import models
from django.conf import settings

class FIR(models.fields.Field):
    pass
# Scratch that, use proper models.Model

class FIR(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Approved (Case Filed)'),
        ('REJECTED', 'Rejected'),
    )
    
    fir_id = models.CharField(max_length=20, unique=True, editable=False)
    citizen = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='firs')
    incident_type = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=255)
    incident_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.fir_id:
            self.fir_id = f"FIR-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.fir_id} - {self.incident_type}"

class Case(models.Model):
    STATUS_CHOICES = (
        ('FILED', 'Filed'),
        ('INVESTIGATION', 'Under Investigation'),
        ('EVIDENCE', 'Evidence Collection'),
        ('COURT', 'Court'),
        ('CLOSED', 'Closed'),
    )

    fir = models.OneToOneField(FIR, on_delete=models.CASCADE, related_name='case')
    assigned_officer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_cases')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='FILED')
    predicted_delay_probability = models.FloatField(default=0.0) # Placeholder for basic ML integration
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Case for {self.fir.fir_id}"

class Evidence(models.Model):
    associated_case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='evidence')
    file = models.FileField(upload_to='evidence/')
    description = models.TextField()
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evidence for Case {self.associated_case.id}"

class CourtDate(models.Model):
    associated_case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='court_dates')
    hearing_date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Court Date {self.hearing_date} for Case {self.associated_case.id}"
