from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FIRViewSet, CaseViewSet, EvidenceViewSet, CourtDateViewSet

router = DefaultRouter()
router.register(r'firs', FIRViewSet, basename='fir')
router.register(r'cases', CaseViewSet, basename='case')
router.register(r'evidence', EvidenceViewSet, basename='evidence')
router.register(r'court-dates', CourtDateViewSet, basename='court-date')

urlpatterns = [
    path('', include(router.urls)),
]
