import { useCallback, useEffect, useState } from 'react' 
import { useNavigation, useFocusEffect } from '@react-navigation/native' 
import { FlatList, Heading, HStack, Text, useToast, VStack } from 'native-base' 

import { api } from '@services/api'
import { Group } from '@components/Group' 
import { HomeHeader } from '@components/HomeHeader' 
import { ExerciseCard } from '@components/ExerciseCard' 
import { AppNavigatorProps } from '@routes/app.routes' 
import { AppError } from '@utils/AppError'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { Loading } from '@components/Loading'
import { useAuth } from '@hooks/useAuth'

export function Home() {
  const { user, signOut } = useAuth()
  const [isLoadingExercises, setIsLoadingExercises] = useState(true)
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)
  const [groups, setGroups] = useState<string[]>([]) 
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]) 
  const [groupSelected, setGroupSelected] = useState('costas') 

  const navigation = useNavigation<AppNavigatorProps>()
  const toast = useToast()

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate('exercise', {exerciseId}) 
  }

  async function fetchGroups(){
    try {
      const response = await api.get('/groups')
      setGroups(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos. Tente mais tarde.'
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoadingGroups(false)
    }
  } 

  async function fetchExercises(){
    try {
      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios. Tente mais tarde.'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoadingExercises(false)
    }
  }
  useEffect(() => {
    fetchGroups()
  },[])
  
  useFocusEffect(useCallback(() => {
    fetchExercises()
  },[groupSelected]))
  return (
    <VStack flex={1}>
     
      <HomeHeader />
      <Text color="gray.100" fontSize="lg" fontWeight={"bold"} ml={8} mt={5}>
          Olá, {user.name}
        </Text>

      {
        isLoadingGroups ? <Loading /> :
        <FlatList 
          data={groups}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Group 
              name={item}
              isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
              onPress={() => setGroupSelected(item)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{
            px: 8,
          }}
          my={10}
          maxH={10}
          minH={10}
        />
      }


      {
        isLoadingExercises ? <Loading /> :
        <VStack px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList 
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ExerciseCard
              data={item}
              onPress={()=>handleOpenExerciseDetails(item.id)}/>
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20
            }}
          />

        </VStack>
      }
    </VStack>
  ) 
}