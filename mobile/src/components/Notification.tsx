import { HStack, Text, IconButton, CloseIcon, Icon, Pressable } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { OSNotification } from 'react-native-onesignal';
import { useNavigation } from '@react-navigation/native';

import { AppNavigatorProps } from '@routes/app.routes' 
type Props = {
  data: OSNotification
  onClose: () => void;
}

type AdditionalData = {
  route?: string
  exercise_id?: string
}
export function Notification({ data, onClose }: Props) {

  const navigation = useNavigation<AppNavigatorProps>()
  function handleOnPress(){
    const {route, exercise_id} = data.additionalData as AdditionalData
    if(route === 'exercise' && exercise_id){
      navigation.navigate('exercise', {exerciseId: exercise_id}) 
      onClose()
    }
  }
  
  return (
    <Pressable w="full" p={4} pt={12} bgColor="gray.200" position="absolute" onPress={handleOnPress}>
      <HStack 
        justifyContent="space-between" 
        alignItems="center" 
        top={0}
      >
          <Icon as={Ionicons} name="notifications-outline" size={5} color="black" mr={2}/>

          <Text fontSize="md" color="black" flex={1}>
            {data.title}
          </Text>

        <IconButton 
          variant="unstyled" 
          _focus={{ borderWidth: 0 }} 
          icon={<CloseIcon size="3" />} 
          _icon={{ color: "coolGray.600"}} 
          color="black"
          onPress={onClose}
        />
      </HStack>
    </Pressable>
  );
}