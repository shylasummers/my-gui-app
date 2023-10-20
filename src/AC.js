import React from "react";
import { useRadio, Box, useRadioGroup, HStack } from "@chakra-ui/react";

function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        borderColor="teal.400"
        boxShadow="md"
        bg="white"
        ml="75px"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

function AC({ onACChange }) {
  const handleRadioChange = (event) => {
    onACChange(event);
  };

  const options = ["Yes", "No"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "ac",
    defaultValue: "Yes",
    onChange: handleRadioChange,
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
}

export default AC;
