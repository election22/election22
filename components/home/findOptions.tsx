import {
  Heading,
  VStack,
  Divider,
  Center,
  Text,
  Image,
  FormControl,
  FormLabel,
  Spinner,
  Box,
  HStack,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { Card } from "../layout/card";
import { SideBySide } from "../layout/sideBySide";
import { LocalitySearch } from "../localitySearch";
import { useUserContext } from "../userContext";
import {
  CandidateResult,
  CandidatesResponse,
} from "../../pages/api/candidates";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { EmptyMessage } from "../emptyMessage";

export const FindOptions: React.FC = () => {
  return (
    <SideBySide
      bgColor={"gray.200"}
      left={
        <>
          <Heading>1. Find your options</Heading>
          <Text>See which parties have candidates in your electorate.</Text>
          <HStack>
            <Image
              alt="AEC logo"
              w="30px"
              borderRadius={"100%"}
              src="/aec-logo.jpg"
            />
            <Text fontSize={"small"}>
              Electorates provided by the{" "}
              <Link href="https://electorate.aec.gov.au/" target={"_blank"}>
                Australian Electoral Commission
              </Link>
            </Text>
          </HStack>
          <HStack>
            <Image
              alt="tallyroom logo"
              w="30px"
              borderRadius={"100%"}
              src="/tallyroom-logo.jpg"
            />
            <Text fontSize={"small"}>
              Candidates provided by{" "}
              <Link href="https://www.tallyroom.com.au" isExternal>
                The Tally Room
              </Link>
            </Text>
          </HStack>
        </>
      }
      right={
        <Card>
          <VStack align="stretch" spacing={4}>
            <PartySearch />
          </VStack>
        </Card>
      }
    ></SideBySide>
  );
};

const PartySearch = () => {
  const { setElectorate, electorate, electorateUrl } = useUserContext();

  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>Select your suburb:</FormLabel>
        <LocalitySearch
          name="locality-search"
          placeholder="Enter your suburb or locality"
          onChange={(value) => {
            setElectorate(value.electorate);
          }}
        />
      </FormControl>

      {electorate && (
        <Text fontSize={"large"} fontWeight={"semibold"}>
          Your electorate is{" "}
          {electorateUrl ? (
            <Link href={electorateUrl} isExternal>
              {electorate.toUpperCase()}
              <ExternalLinkIcon mx="2px" pb="4px" />
            </Link>
          ) : (
            electorate.toUpperCase()
          )}
        </Text>
      )}

      <Divider />
      <CandidatesList electorate={electorate} />
    </VStack>
  );
};

const CandidatesList: React.FC<{ electorate: string }> = ({ electorate }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { candidates, setCandidates, setElectorateUrl } = useUserContext();

  useEffect(() => {
    if (!electorate) {
      return;
    }
    setIsLoading(true);
    try {
      getCandidatesForElectorate(electorate).then((result) => {
        setIsLoading(false);
        setCandidates(result.candidates);
        setElectorateUrl(result.electorateUrl);
      });
    } catch (e) {
      setIsLoading(false);
      console.warn(e);
    }
  }, [electorate, setCandidates, setElectorateUrl]);

  if (!electorate) {
    return (
      <EmptyMessage>
        <Text color="gray.400">
          Select your electorate above to see your candidates
        </Text>
      </EmptyMessage>
    );
  }

  if (isLoading) {
    return (
      <Center h="100%">
        <Spinner />
      </Center>
    );
  }

  return (
    <VStack align="flex-start">
      <Text fontWeight={"semibold"} as="u">
        Candidates:
      </Text>
      {candidates.map((candidate) => (
        <CandidateItem candidate={candidate} />
      ))}
    </VStack>
  );
};

const CandidateItem: React.FC<{ candidate: CandidateResult }> = ({
  candidate,
}) => {
  const linkDomain = candidate.url ? new URL(candidate.url).hostname : false;

  return (
    <HStack
      w="100%"
      border="1px solid"
      borderColor={"gray.300"}
      borderRadius={4}
      p={2}
      spacing={2}
      align="center"
      key={candidate.name}
    >
      {linkDomain ? (
        <Image src={`https://icon.horse/icon/${linkDomain}`} w={"40px"} />
      ) : (
        <Box w="40px" h="40px" bgColor={"gray.600"} />
      )}
      <VStack spacing={0} align="flex-start">
        <Text as="span">{candidate.party}</Text>{" "}
        <Text color="gray.500" fontSize={"small"} as="span">
          {candidate.url ? (
            <Link href={candidate.url} isExternal>
              {candidate.name} <ExternalLinkIcon mx="2px" />
            </Link>
          ) : (
            candidate.name
          )}
        </Text>
      </VStack>
    </HStack>
  );
};

async function getCandidatesForElectorate(electorate: string) {
  const res = await axios.get<CandidatesResponse>(
    `api/candidates?electorate=${electorate}`
  );
  return res.data;
}
