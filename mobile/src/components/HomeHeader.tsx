import { HStack, Text, Icon, VStack } from "native-base" 
import { UserPhoto } from "./UserPhoto" 
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native" 
import defaultImg from '@assets/user.png'
import LogoSvg from '@assets/logo_academia.svg'
import Logout from '@assets/sign-out.svg'
import { useAuth } from "@hooks/useAuth"
import { api } from "@services/api"

export function HomeHeader(){
  const { user, signOut } = useAuth()
 
  return (
    
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
        <LogoSvg  />
        <Text color="gray.100" fontSize="md" ml={2}  fontWeight="bold">Mundo Fitness</Text>
 
      <VStack flex={1} alignItems={"center"}>
      <UserPhoto
        source={user.photo ? { uri: `${api.defaults.baseURL}/photo/${user.photo}` }: defaultImg}
        alt="Imagem do perfil"
        size={16}
        mr={12}
      />
      </VStack>
      <TouchableOpacity onPress={signOut}>
       <Logout fill={"#FFD700"} width={24} height={24}/>
      </TouchableOpacity>
    </HStack>
  )
}