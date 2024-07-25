import { useNavigation } from '@react-navigation/native'
import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useToast } from 'native-base'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

import LogoSvg from '@assets/logo_academia.svg'
import BackgroundImg from '@assets/background.png'

import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'

type FormDataProps = {
  name: string
  email: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Nome obrigatório').min(3, 'No mínimo 3 caracteres'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória').min(6, 'No mínimo 6 caracteres'),
  password_confirm: yup.string().required('Confirme sua senha').oneOf([yup.ref('password'), ''], 'As senhas precisam ser iguais'),
})
export function SignUp(){
  const toast = useToast()
  const { signIn} = useAuth()

  const {
    control, 
    handleSubmit, 
    formState: {errors, isSubmitting}} = 
  useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })
  async function handleSignUp({name, email, password, password_confirm}: FormDataProps){
   try {
    await api.post('/users', {name, email, password, password_confirm})
    await signIn(email, password)
   } catch(error){
    const isAppError = error instanceof AppError 

    toast.show({
      title: isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500'
    })
   }
  }
  const navigation = useNavigation()

  function handleGoBack(){
    navigation.goBack()
  }
  return(
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
     <VStack flex={1} px={10} pb={16}>
      <Image 
        source={BackgroundImg} 
        alt="Pessoas treinando" 
        resizeMode="contain" 
        position="absolute" 
      />

      <Center my={24}>
        <LogoSvg />
        <Text color="gray.100" fontSize="sm">Treine sua mente e o seu corpo</Text>
      </Center>

      <Center>
      <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
        Crie sua conta
      </Heading>
      <Controller 
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input 
            mb={4} 
            placeholder='Nome'
            onChangeText={onChange}
            value={value}
            errorMessage={errors.name?.message}
            onSubmitEditing={handleSubmit(handleSignUp)}
          /> 
        )}
      />

      <Controller 
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input 
            mb={4} 
            placeholder='E-mail'
            onChangeText={onChange}
            value={value}
            errorMessage={errors.email?.message}
          /> 
        )}
      />

      <Controller 
        control={control}
        name="password"
        rules={{ required: true }} 
        render={({ field: { onChange, value } }) => (
          <Input 
            mb={4} 
            placeholder='Senha'
            onChangeText={onChange}
            value={value}
            secureTextEntry
            errorMessage={errors.password?.message}
          /> 
        )}
    />

      <Controller 
        control={control}
            name="password_confirm"
            rules={{ required: true }} 
            render={({ field: { onChange, value } }) => (
              <Input 
                mb={4} 
                placeholder='Confirme a senha'
                onChangeText={onChange}
                value={value}
                secureTextEntry
                errorMessage={errors.password_confirm?.message}
                returnKeyType="send"
          /> 
        )}
      />
     <Button 
      title="Criar e acessar"
      mt={6}
      onPress={handleSubmit(handleSignUp)}
      isLoading={isSubmitting}
       />
     
    </Center>
    
      <Button 
        title="Voltar para o login"
        variant="outline"
        mt={24}
        onPress={handleGoBack}
        disabled={isSubmitting}
      />
    </VStack>
    </ScrollView>
   
  )
}
