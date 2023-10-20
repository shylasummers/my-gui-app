import React from "react";
import { Flex, NumberInput, NumberInputField } from "@chakra-ui/react";

function CO({ onCOEmissionsChange }) {
  const handleInputChange = (event) => {
    onCOEmissionsChange(event);
  };

  return (
    <Flex
      borderColor="teal.400"
      borderWidth="2px"
      borderRadius="md"
      bg="white"
      ml="75px"
      mr="75px"
    >
      <NumberInput type="number" flex="1" onChange={handleInputChange}>
        <NumberInputField />
      </NumberInput>
    </Flex>
  );
}

export default CO;
