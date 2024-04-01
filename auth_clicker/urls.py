from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    # path('login/', views.user_login, name='login'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.user_logout),
    path('registration/', views.Register.as_view(), name='registration'),
    # path('registration/', views.user_registration, name='registration'),
    path('user/<int:pk>/', views.UserDetail.as_view()),
]
