from rest_framework import serializers
from .models import FIR, Case, Evidence, CourtDate
from accounts.serializers import UserSerializer

class EvidenceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)

    class Meta:
        model = Evidence
        fields = '__all__'
        read_only_fields = ('uploaded_by',)

class CourtDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourtDate
        fields = '__all__'

class CaseSerializer(serializers.ModelSerializer):
    assigned_officer_details = UserSerializer(source='assigned_officer', read_only=True)
    evidence = EvidenceSerializer(many=True, read_only=True)
    court_dates = CourtDateSerializer(many=True, read_only=True)
    
    class Meta:
        model = Case
        fields = '__all__'

class FIRSerializer(serializers.ModelSerializer):
    citizen_name = serializers.CharField(source='citizen.username', read_only=True)
    case_details = CaseSerializer(source='case', read_only=True)

    class Meta:
        model = FIR
        fields = '__all__'
        read_only_fields = ('fir_id', 'citizen', 'status')
