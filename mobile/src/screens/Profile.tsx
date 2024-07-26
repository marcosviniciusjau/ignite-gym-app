import { VStack, Skeleton, ScrollView, Center, Text, Heading, useToast } from 'native-base'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { Controller, useForm } from 'react-hook-form'
import * as ImagePicker from 'expo-image-picker'

import * as FileSystem from 'expo-file-system'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { ScreenHeader } from '@components/ScreenHeader'

import { UserPhoto } from '@components/UserPhoto'
import defaultImg from '@assets/userPhotoDefault.png'

import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { api } from '@services/api'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'

const PHOTO_SIZE = 33
type FormData = {
  name: string
  email: string
  password?: string | null | undefined
  old_password?: string | null
  confirm_password?: string | null | undefined
}

const profileSchema = yup.object({
  name: yup
    .string()
    .required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field, 
      then: yup
        .string()
        .nullable()
        .required('Informe a confirmação da senha.')
        .transform((value) => !!value ? value : null)
    }),
})

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ 
    defaultValues: { 
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema) 
  });
  async function handleUserPhotoSelected() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [4, 4],
      })
      if(photoSelected.canceled) {
        return
      }
      if(photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)
        if(photoInfo.exists && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500'
          })
        }
        const fileExtension = photoSelected.assets[0].uri.split('.').pop()
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any
        const uploadForm= new FormData()
        uploadForm.append('photo', photoFile)

       const photoUpdated =  await api.patch('/users/photo', uploadForm, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        const userUpdated = user
        user.photo = photoUpdated.data.photo
        updateUserProfile(userUpdated)
      }

    } catch (error) {
      console.error(error)
    }
    finally{
      setPhotoIsLoading(false)
    }
  }
  
  async function handleUpdateProfile(data : FormData) {
    try {
      const userUpdated = user
      userUpdated.name = data.name
      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
          title: 'Perfil atualizado com sucesso!',
          placement: 'top',
          bgColor: 'green.500'
        })

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente mais tarde.'
      toast.show({ title, placement: 'top', bgColor: 'red.500' })
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil"/>
      <ScrollView>
        <Center mt={6} px={10}>
          {
            photoIsLoading ?
            <Skeleton 
            w={PHOTO_SIZE} 
            h={PHOTO_SIZE}
            rounded="full"
            startColor="gray.500"
            endColor="gray.400"
          />
          :
          <UserPhoto
            source={user.photo ? { uri: `${api.defaults.baseURL}/photo/${user.photo}` }: defaultImg}

            alt="Imagem do perfil"
            size={PHOTO_SIZE}
          />
        }
        <TouchableOpacity onPress={handleUserPhotoSelected} >
          <Text color="gold.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>Alterar foto</Text>
        </TouchableOpacity>

        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <Input
              placeholder="Nome"
              bg="gray.600"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { value } }) => (
            <Input
              bg="gray.600"
              placeholder="Email"
              isDisabled
              value={value}
            />
          )}
        />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontFamily="heading" fontSize="md" mb={2}>
            Alterar senha
          </Heading>

        <Controller
          control={control}
          name="old_password"
          render={({ field: { onChange } }) => (
            <Input
              placeholder="Senha antiga"
              bg="gray.600"
              secureTextEntry
              mb={4}
              onChangeText={onChange}
            />
          )}
        />

       <Controller
          control={control}
          name="password"
          render={({ field: { onChange } }) => (
            <Input
              placeholder="Nova senha"
              bg="gray.600"
              secureTextEntry
              mb={4}
              onChangeText={onChange}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirm_password"
          render={({ field: { onChange } }) => (
            <Input
              placeholder="Confirme a nova senha"
              bg="gray.600"
              secureTextEntry
              mb={4}
              onChangeText={onChange}
              errorMessage={errors.confirm_password?.message}
            />
          )}
        />
          <Button 
            title="Atualizar"
            mt={4}
            isLoading={isSubmitting}
            onPress={handleSubmit(handleUpdateProfile)}
           />
        </VStack>
      </ScrollView>
    </VStack>
  )
}