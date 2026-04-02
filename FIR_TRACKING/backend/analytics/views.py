from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count
from fir_cases.models import FIR, Case
from django.contrib.auth import get_user_model

User = get_user_model()

class AnalyticsSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ADMIN':
            return Response({"error": "Admin only"}, status=403)

        total_firs = FIR.objects.count()
        pending_firs = FIR.objects.filter(status='PENDING').count()
        
        total_cases = Case.objects.count()
        under_investigation = Case.objects.filter(status='INVESTIGATION').count()
        closed_cases = Case.objects.filter(status='CLOSED').count()

        monthly_firs = FIR.objects.values('created_at__month').annotate(total=Count('id')).order_by('created_at__month')

        total_officers = User.objects.filter(role='POLICE').count()

        return Response({
            "total_firs": total_firs,
            "pending_firs": pending_firs,
            "total_cases": total_cases,
            "under_investigation": under_investigation,
            "closed_cases": closed_cases,
            "total_officers": total_officers,
            "monthly_trends": list(monthly_firs),
        })
