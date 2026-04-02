from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import FIR, Case, Evidence, CourtDate
from .serializers import FIRSerializer, CaseSerializer, EvidenceSerializer, CourtDateSerializer
from notifications.models import Notification

class FIRViewSet(viewsets.ModelViewSet):
    serializer_class = FIRSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CITIZEN':
            return FIR.objects.filter(citizen=user)
        elif user.role == 'POLICE':
            # Police see assigned FIRs and maybe all approved FIRs (simplified to all for now)
            return FIR.objects.all()
        return FIR.objects.all()

    def perform_create(self, serializer):
        serializer.save(citizen=self.request.user)
        # Notify admin of new FIR
        Notification.objects.create(
            user_id=1, # Assuming admin is id 1 for simplicity, better to filter by role='ADMIN'
            message=f"New FIR filed by {self.request.user.username}"
        )

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        if request.user.role == 'CITIZEN':
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        fir = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            fir.status = new_status
            fir.save()
            
            # If approved, automatically create a Case
            if new_status == 'APPROVED' and not hasattr(fir, 'case'):
                Case.objects.create(fir=fir)
                Notification.objects.create(
                    user=fir.citizen,
                    message=f"Your FIR {fir.fir_id} has been Approved and a case has been opened."
                )
            return Response(FIRSerializer(fir).data)
        return Response({"error": "Status required"}, status=status.HTTP_400_BAD_REQUEST)

class CaseViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CITIZEN':
            return Case.objects.filter(fir__citizen=user)
        elif user.role == 'POLICE':
            return Case.objects.filter(assigned_officer=user)
        return Case.objects.all()

    @action(detail=True, methods=['patch'])
    def assign_officer(self, request, pk=None):
        if request.user.role != 'ADMIN':
            return Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)
        
        case = self.get_object()
        officer_id = request.data.get('officer_id')
        if officer_id:
            case.assigned_officer_id = officer_id
            case.save()
            Notification.objects.create(
                user_id=officer_id,
                message=f"You have been assigned to Case {case.id} (FIR: {case.fir.fir_id})"
            )
            return Response(CaseSerializer(case).data)
        return Response({"error": "Officer ID required"}, status=status.HTTP_400_BAD_REQUEST)

class EvidenceViewSet(viewsets.ModelViewSet):
    serializer_class = EvidenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Evidence.objects.all()

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class CourtDateViewSet(viewsets.ModelViewSet):
    serializer_class = CourtDateSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = CourtDate.objects.all()
    
    def perform_create(self, serializer):
        court_date = serializer.save()
        case = court_date.associated_case
        Notification.objects.create(
            user=case.fir.citizen,
            message=f"A new court hearing has been scheduled for your case on {court_date.hearing_date.strftime('%Y-%m-%d')}"
        )
