from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('registration/', views.Register.as_view(), name='registration'),
    path('user/<int:pk>/', views.UserDetail.as_view()),
]
