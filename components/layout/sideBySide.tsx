import { BoxProps, Grid, GridItem, VStack } from "@chakra-ui/react";
import { Hero } from "./hero";

interface SideBySideProps extends Omit<BoxProps, "left" | "right"> {
  left: React.ReactNode;
  right: React.ReactNode;
}

export const SideBySide: React.FC<SideBySideProps> = ({
  left,
  right,
  ...boxProps
}) => {
  return (
    <Hero {...boxProps}>
      <Grid gap={{ base: 8, md: 16 }} templateColumns={"repeat(5, 1fr)"}>
        <GridItem colSpan={{ base: 5, md: 2 }}>
          <VStack align="flex-start" spacing={8}>
            {left}
          </VStack>
        </GridItem>
        <GridItem colSpan={{ base: 5, md: 3 }}>
          <VStack align="flex-start" spacing={8}>
            {right}
          </VStack>
        </GridItem>
      </Grid>
    </Hero>
  );
};
