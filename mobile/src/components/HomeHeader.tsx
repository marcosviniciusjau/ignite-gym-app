import { HStack, Heading, Text, Icon, VStack } from "native-base" 
import { UserPhoto } from "./UserPhoto" 
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native" 
import defaultImg from '@assets/userPhotoDefault.png'
import LogoSvg from '@assets/logo.svg'
import { useAuth } from "@hooks/useAuth"
import { api } from "@services/api"

export function HomeHeader(){
  const { user, logout } = useAuth()
 
  return (
    
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
        <LogoSvg width={102} height={40} />

 
      <VStack flex={1} alignItems={"center"}>
      <UserPhoto
        source={user.photo ? { uri: `${api.defaults.baseURL}/photo/${user.photo}` }: defaultImg}
        alt="Imagem do perfil"
        size={16}
        mr={12}
      />
      </VStack>
      <TouchableOpacity onPress={logout}>
       <Icon as={MaterialIcons} name="logout" size={7} color="gold.500" />
      </TouchableOpacity>
    </HStack>
  )
}