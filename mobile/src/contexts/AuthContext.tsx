import { UserDTO } from "@dtos/UserDTO" 
import { createContext, useState, useEffect } from "react" 
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser"

import { api } from "@services/api" 
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken"
import { Use } from "react-native-svg"

export type AuthContextDataProps = {
 user: UserDTO
 signIn: (email: string, password: string) => Promise<void>,
 logout: () => Promise<void>,
 updateProfile: (userUpdated: UserDTO) => Promise<void>,
 isLoading: boolean
}

type AuthContextProviderProps = {
  children: React.ReactNode
}
export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({children}: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoading, setIsLoading] = useState(true)

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
    try {
      setIsLoading(true)
      await storageUserSave(userData)
      await storageAuthTokenSave({token, refresh_token})
    } catch (error) {
      throw error
    } finally{
      setIsLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
   try {
    const { data } = await api.post('/sessions', {
      email,
      password
    })
    if(data.user && data.token && data.refresh_token) {   
      await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
      userAndTokenUpdate(data.user, data.token)
    }
   } catch (error) {
    throw error
   } finally{
    setIsLoading(false)
   }
  }

  async function loadUserData(){
    try {
      setIsLoading(true)
      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()

      if(token && userLogged){
        userAndTokenUpdate(userLogged, token)
      }

    } catch (error) {
      throw error
    } finally{
      setIsLoading(false)
    }
  }

  async function logout(){
    try {
      setIsLoading(true)

      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
    } catch (error) {
      throw error
    } finally{
      setIsLoading(false)
    }
  }

  async function updateProfile(userUpdated: UserDTO){
    try{
     setUser(userUpdated)
     await storageUserSave(userUpdated)
    }catch(error){
      throw error
    }
  }

  useEffect(()=>{
    loadUserData()
  },[])

  useEffect(()=>{
    const subscribe = api.interceptorToken(logout)
    return () => {
      subscribe()
    }
  },[logout])
  return (
  <AuthContext.Provider value={{
    user,
    signIn,
    logout,
    updateProfile,
    isLoading
     }}>
    { children }
  </AuthContext.Provider>
  )
}