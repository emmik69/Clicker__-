from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.response import Response
from .models import Core, Boost
from .serializers import CoreSerializer, BoostSerializer
from rest_framework import viewsets
from backend.models import Core, Boost


@api_view(['GET'])
def call_click(request):
  core = Core.objects.get(user=request.user)
  is_levelup = core.click()
  if is_levelup:
    Boost.objects.create(core=core, price=core.coins, power=core.level*2)
  core.save()
  
  return Response({'core': CoreSerializer(core).data, 'is_levelup': is_levelup})

@api_view(['GET'])
def get_core(request):
    core = Core.objects.get(user=request.user)
    return Response({'core': CoreSerializer(core).data})

@api_view(['POST']) 
def update_coins(request): 
    coins = request.data['current_coins']
    core = Core.objects.get(user=request.user)
   
    is_levelup, boost_type = core.set_coins(coins)
   
    if is_levelup: 
        Boost.objects.create(core=core, price=core.coins, power=core.level*2, type=boost_type)
    core.save()

    return Response({
        'core': CoreSerializer(core).data, 
        'is_levelup': is_levelup,
    })


class BoostViewSet(viewsets.ModelViewSet):
  queryset = Boost.objects.all()
  serializer_class = BoostSerializer
  
  def get_queryset(self):
    core = Core.objects.get(user=self.request.user)
    boosts = Boost.objects.filter(core=core)
    return boosts
  
  def partial_update(self, request, pk):
    coins = request.data['coins']
    boost = self.queryset.get(pk=pk)
    
    is_levelup = boost.levelup(coins)
    if not is_levelup:
      return Response({'error': 'Не хватает денег'})
    
    old_boost_stats, new_boost_stats = is_levelup
    
    return Response({
      'old_boost_stats': self.serializer_class(old_boost_stats).data,
      'new_boost_stats': self.serializer_class(new_boost_stats).data
      })

  