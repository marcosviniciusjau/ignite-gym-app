import { HStack, Heading, Text, Icon, VStack, Image, Box, ScrollView, useToast, useSafeArea} from 'native-base'
import { TouchableOpacity } from 'react-native'

import { Feather } from '@expo/vector-icons'

import { useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorProps } from '@routes/app.routes'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import Repetitions from '@assets/repetitions.svg'

import  ArrowLeft from '@assets/arrow-left.svg'
type RouteParams = {
  exerciseId: string
}
import { Button } from '@components/Button'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useEffect, useState } from 'react'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { Loading } from '@components/Loading'
export function Exercise() {
  const [submitting, setSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const navigate = useNavigation<AppNavigatorProps>()
  const route = useRoute()

  const { exerciseId } = route.params as RouteParams

  const toast = useToast()
  function handleGoBack() {
    navigate.navigate('home')
  }

  async function fetchExercise(){
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios. Tente mais tarde.'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
    finally{
      setIsLoading(false)
    }
  }

  async function handleExerciseRegister(){
    try {
      setSubmitting(true)
      const response = await api.post('/history/', {exercise_id: exerciseId})  
      toast.show({
        title: 'Exercício registrado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })
      setExercise(response.data)
      navigate.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício. Tente mais tarde.'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }finally{
      setSubmitting(false)
    }
  }

  useEffect(()=>{
    fetchExercise()
  },[exerciseId])

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          </TouchableOpacity>

        <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center">
        <ArrowLeft style={{width: 3, height: 3}} onPress={handleGoBack}/>
          <Heading color="gray.100" fontSize="lg" fontFamily="heading">
        
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">{exercise.group}</Text>
          </HStack>
        </HStack>
      </VStack>
      
        {
        isLoading ? <Loading/> :  
        <VStack p={8}>
        <Box rounded="lg" mb={3} overflow="hidden">
          <Image
            w="full"
            h={80}
            source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
            alt="Imagem do exercício"
            resizeMode="cover"
            rounded="lg"
            />
          </Box>
          <Box bg="gray.700" rounded="md" px={4} pb={4}>
            <HStack justifyContent="space-around" alignItems="center" mb={6} mt={5}>
              <HStack>
                <SeriesSvg />
                <Text color="gray.200" ml={2}>{exercise.series} séries</Text>
              </HStack>

            <HStack>
                <Repetitions />
                <Text color="gray.200" ml={2}>{exercise.repetitions} repetições</Text>
            </HStack>
            
            </HStack>
            <Button 
             title="Marcar como realizado"
             isLoading={submitting}
             onPress={handleExerciseRegister}
            />
          </Box>
        </VStack>
        }
    

    </VStack>
  )
}