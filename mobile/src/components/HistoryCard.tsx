import { HistoryDTO } from "@dtos/HistoryDTO"
import { HStack, VStack, Heading, Text } from "native-base" 

type Props = {
  data: HistoryDTO
}
export function HistoryCard({data}: Props) {
  return (
    <HStack
      w="full"
      px={5}
      py={4}
      mb={3}
      bg="gray.600"
      rounded="md"
      justifyContent="space-between"
      alignItems="center"
    >
      <VStack mr={5} flex={1}>
        <Heading
          color="white"
          fontSize="md"
          fontFamily="heading"
          textTransform="capitalize"
          numberOfLines={1}
          >
          {data.name}
        </Heading>

        <Text color="gray.100" fontSize="lg" numberOfLines={1}>
          {data.group}
        </Text>
      </VStack>
        <Text color="gray.300" fontSize="md"> {data.hour}</Text>
    </HStack>
  )
}