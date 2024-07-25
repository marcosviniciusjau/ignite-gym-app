import {useTheme} from 'native-base'
import { NavigationContainer, DefaultTheme } from "@react-navigation/native" 
import { AuthRoutes } from "./auth.routes" 
import { AppRoutes } from "./app.routes" 
import { OneSignal, NotificationWillDisplayEvent, OSNotification } from 'react-native-onesignal'
import { AuthContext } from '@contexts/AuthContext' 
import { useContext, useEffect, useState } from 'react' 
import { useAuth } from '@hooks/useAuth' 
import { Loading } from '@components/Loading'

import { Notification } from '@components/Notification'
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO'
export function Routes(){
  const {colors} = useTheme()
  const theme = DefaultTheme 
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])
  theme.colors.background = colors.gray[700] 

  const { user } = useAuth()
  const [notification, setNotification]= useState<OSNotification>()

  const contextData = useContext(AuthContext)

 function tagUserInfoCreate(){
    OneSignal.User.addTags({
      user_name: user.name,
      user_email: user.email
    })
  }
  
  useEffect(() => {
    const handleNotification = (event: NotificationWillDisplayEvent) : void => {
      event.preventDefault()
      const response = event.getNotification()
      setNotification(response)
    }
    OneSignal.Notifications.addEventListener("foregroundWillDisplay", 
      handleNotification
    )
    tagUserInfoCreate()
    return () => 
      OneSignal.Notifications.removeEventListener(
      "foregroundWillDisplay",
       handleNotification
    )
    
  },[tagUserInfoCreate])
  
  return(
    <NavigationContainer theme={theme}>
      {user.id ? <AppRoutes /> : <AuthRoutes />}

      {
        notification?.title &&
        <Notification data={notification} onClose={() => {setNotification(undefined)}}/>}
    </NavigationContainer>
  )
}