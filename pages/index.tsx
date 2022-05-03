import {
  Button,
  Center,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Hero } from "../components/layout/hero";
import { MasterLayout } from "../components/layout/master";
import { SideBySide } from "../components/layout/sideBySide";
import { FindOptions } from "../components/home/findOptions";
import { FindPolicies } from "../components/home/findPolicies";
import Head from "next/head";
import { ChevronRightIcon, CopyIcon, StarIcon } from "@chakra-ui/icons";

export default function Home() {
  return (
    <MasterLayout>
      <Head>
        <title>Election22</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Hero bgColor={"gray.800"} color="white" h="100vh">
        <Center h="100%">
          <HStack w="100%">
            <VStack align="flex-start" spacing={8}>
              <Heading size="4xl">Make your vote count</Heading>
              <Heading size="lg">
                <Text>
                  The Australian 2022 Federal Election,{" "}
                  <Text as="span" color="orange.500">
                    simplified
                  </Text>
                </Text>
              </Heading>
              <Button
                size="lg"
                colorScheme={"orange"}
                onClick={(event) => {
                  event.preventDefault();
                  document
                    .querySelector("#introduction")
                    .scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Get started <ChevronRightIcon ml={2} />
              </Button>
            </VStack>
          </HStack>
        </Center>
      </Hero>

      <SideBySide
        id="introduction"
        left={
          <VStack align="flex-start">
            <Heading>
              Your local representative rebels less than{" "}
              <Text as="span" color="orange.500">
                <Link
                  href="https://theyvoteforyou.org.au/people?sort=rebellions"
                  isExternal
                >
                  2%
                </Link>
              </Text>{" "}
              of the time
            </Heading>
          </VStack>
        }
        right={
          <>
            <Text>
              <Link
                href="https://theyvoteforyou.org.au/people?sort=rebellions"
                isExternal
                sx={{ textDecoration: "underline" }}
                _hover={{ color: "orange.500" }}
              >
                {" "}
                Official Parliament records
              </Link>{" "}
              show that Australian politics is no longer driven by
              representatives, but by party politics. If your local
              representative belongs to a party, they&apos;re voting almost
              entirely along party lines.
            </Text>
            <Text>
              Before you cast your vote on May 21, see how our politicians are{" "}
              <b>actually</b> voting on the issues you care about - you may be
              surprised.
            </Text>
          </>
        }
      ></SideBySide>

      <FindOptions />

      <FindPolicies />

      <SideBySide
        left={<Heading>Did you find this helpful?</Heading>}
        right={
          <VStack spacing={4} align="flex-start">
            <Button
              onClick={async () => {
                await navigator.share({
                  title: "Election22",
                  text: `Check out Election22 - Information about the upcoming Australian federal election`,
                  url: `${window.location.href}`,
                });
              }}
              colorScheme={"orange"}
            >
              <CopyIcon mr={2} />
              Share this page
            </Button>
            <Button
              as="a"
              href="https://www.buymeacoffee.com/election2022"
              target="_blank"
            >
              <StarIcon mr={2} />
              Buy me a coffee
            </Button>
          </VStack>
        }
      />

      {/* <SideBySide
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
      /> */}
    </MasterLayout>
  );
}
