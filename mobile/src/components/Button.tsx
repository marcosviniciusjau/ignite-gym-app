import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base'
type Props = IButtonProps & {
  title: string
  variant?: 'solid' | 'outline'
}
export function Button({ title, variant='solid', ...rest }: Props) {
  return (
    <NativeBaseButton
      w="full"
      bg={ variant === "outline" ? "transparent" : "gold.500"}
      h={14}
      fontSize="sm"
      rounded="sm"
      borderWidth={ variant === "outline" ? 1 : 0}
      borderColor="gold.500"
      _pressed={{ bg: variant === "outline" ? "gray.500" : "gold.500" }}
      {...rest}
    >
      <Text 
        color={ variant === "outline" ? "gold.500" : "black"} 
        fontFamily="heading" 
        fontSize="sm"
      >
        {title}
      </Text>
    </NativeBaseButton>

  )
}