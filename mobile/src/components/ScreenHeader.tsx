import { Center, Heading } from "native-base" 
import React from "react" 
import LogoSvg from "../assets/logo.svg" 
type Props = {
  title: string
}
export function ScreenHeader({title}: Props) {
  return (
    <Center
      bg="gray.600"
      pt={16}
      pb={5}
      px={8}
      alignItems="center"
      justifyContent="space-between"
    >
      <Heading color="gray.100" fontSize="xl" fontFamily="heading">
        {title}
      </Heading>
    </Center>
  ) 
}