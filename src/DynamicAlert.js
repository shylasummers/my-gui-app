import React from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";

function DynamicAlert({ title, content, type }) {
  const alertColor = type === "error" ? "red.500" : "green.500";
  return (
    <Alert
      width="1000px"
      status={type}
      color={alertColor}
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      rounded="md"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">{title}</AlertTitle>
      <AlertDescription maxWidth="xl">{content}</AlertDescription>
    </Alert>
  );
}

export default DynamicAlert;
