import { Box, BoxProps, Container } from "@chakra-ui/react";
import React from "react";

export const Hero: React.FC<BoxProps> = ({ children, ...boxProps }) => {
  return (
    <Box py={24} {...boxProps}>
      <Container h="100%" maxW="container.lg">
        {children}
      </Container>
    </Box>
  );
};
