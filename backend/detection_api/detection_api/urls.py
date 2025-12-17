from django.urls import path
from . import views

urlpatterns = [
    path('models/', views.models_list, name='models'),
    path('predict/', views.predict_view, name='predict'),
    path('predictions/', views.predictions_list, name='predictions'),
    path('explain/', views.explain_view, name='explain'),
]