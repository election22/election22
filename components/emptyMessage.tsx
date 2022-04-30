import { Center, CenterProps } from "@chakra-ui/react";

export const EmptyMessage: React.FC<CenterProps> = ({
  children,
  ...centerProps
}) => {
  return (
    <Center
      border="1px dashed"
      borderColor={"gray.300"}
      borderRadius={4}
      minH={200}
      {...centerProps}
    >
      {children}
    </Center>
  );
};
