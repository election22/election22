import { Box, BoxProps } from "@chakra-ui/react";

export const Card: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      borderRadius={4}
      shadow="md"
      bgColor={"white"}
      w="100%"
      px={{ base: 4, md: 8 }}
      py={{ base: 4, md: 8 }}
      {...props}
    >
      {children}
    </Box>
  );
};
