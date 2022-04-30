import { Box, Center, Container, Flex, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { PropsWithChildrenOnly } from "../../types";

export const MasterLayout: React.FC<PropsWithChildrenOnly> = ({ children }) => {
  return (
    <Flex minH="100%" direction="column">
      {/* <Header /> */}
      <Box flex="1 0 auto">{children}</Box>
      <Footer />
    </Flex>
  );
};

const Header: React.FC = () => {
  return (
    <HStack
      as="header"
      position={"sticky"}
      bgColor="white"
      shadow={"md"}
      top={0}
      w="100%"
      h={16}
      alignItems={"center"}
      zIndex={2}
      px={4}
    >
      <p>&#127462;&#127482;</p>
      <p>Election 22</p>
    </HStack>
  );
};

const Footer: React.FC = () => {
  return (
    <Center bgColor={"gray.700"} color="white" as="footer" h="250px">
      <Container maxW={"container.lg"}>
        <Text size="lg">Made with ❤️ in Brisbane, Australia</Text>
      </Container>
    </Center>
  );
};
