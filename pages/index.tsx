import {
  Button,
  Center,
  Heading,
  HStack,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import { Hero } from "../components/layout/hero";
import { MasterLayout } from "../components/layout/master";
import { SideBySide } from "../components/layout/sideBySide";
import { FindOptions } from "../components/home/findOptions";
import { FindPolicies } from "../components/home/findPolicies";

export default function Home() {
  return (
    <MasterLayout>
      <Hero bgColor={"gray.800"} color="white" h="100vh">
        <Center h="100%">
          <HStack w="100%">
            <VStack align="flex-start" spacing={8}>
              <Heading size="3xl">Make your vote count</Heading>
              <Text>
                The Australian 2022 Federal Election,{" "}
                <Text as="span" color="orange.500">
                  simplified
                </Text>
              </Text>
            </VStack>
          </HStack>
        </Center>
      </Hero>

      <SideBySide
        left={
          <Heading>
            Your local representative rebels less than{" "}
            <Text as="span" color="orange.500">
              0.48%
            </Text>{" "}
            of the time
          </Heading>
        }
        right={
          <>
            <Text>
              Official Parliament records show that Australian politics is no
              longer driven by representatives, but by party politics. Your
              local representative votes almost entirely on their party&apos;s
              agenda.
            </Text>
            <Text>
              Voters need to vote for the <b>party</b> that best represents
              their values, not for individuals who <i>seem</i> to represent
              their values.
            </Text>
            <Button>
              <Text>Learn more</Text>
            </Button>
          </>
        }
      ></SideBySide>

      <FindOptions />

      <FindPolicies />

      <SideBySide
        left={
          <>
            <Heading>Not impressed with your options?</Heading>
          </>
        }
        right={
          <>
            <Text>
              If no party represents your values well and you REALLY don&apos;t
              want to vote, you may want to cast an <i>invalid vote</i> rather
              than a donkey vote.
            </Text>
            <UnorderedList>
              <ListItem>
                A donkey vote counts towards the election, just like a valid
                vote.
              </ListItem>
              <ListItem>
                An invalid vote is excluded from results, so the AEC will know
                exactly how many dissatisfied voters there are.
              </ListItem>
            </UnorderedList>
          </>
        }
      />
    </MasterLayout>
  );
}
