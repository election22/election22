import { CandidateResult, ElectorateDetails } from "../types/electorate";
import { EmptyMessage } from "./emptyMessage";
import {
  Box,
  Center,
  HStack,
  Link,
  Spinner,
  Text,
  VStack,
  Image,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface ElectorateInfoProps {
  name: string;
  electorateDetails: ElectorateDetails | undefined;
  isLoading: boolean;
}

export const ElectorateInfo: React.FC<ElectorateInfoProps> = ({
  electorateDetails,
  isLoading,
  name,
}) => {
  if (isLoading) {
    return (
      <Center h="100%">
        <Spinner />
      </Center>
    );
  }

  if (!electorateDetails) {
    return (
      <EmptyMessage>
        <Text color="gray.400">
          Select your electorate above to see your candidates
        </Text>
      </EmptyMessage>
    );
  }

  const { candidates, currentMP, electorateUrl } = electorateDetails;

  return (
    <VStack align="flex-start">
      <Text fontSize={"large"} fontWeight={"semibold"}>
        Your electorate is{" "}
        {electorateUrl ? (
          <Link href={electorateUrl} isExternal>
            {name.toUpperCase()}
            <ExternalLinkIcon mx="2px" pb="4px" />
          </Link>
        ) : (
          name.toUpperCase()
        )}
      </Text>

      <Divider />

      <Text fontWeight={"semibold"} as="u">
        Candidates:
      </Text>
      {candidates
        .sort((a, b) => (a.isCurrent ? -1 : 1))
        .map((candidate) => (
          <CandidateItem
            key={candidate.name}
            candidate={candidate}
            isCurrent={candidate.name === currentMP}
          />
        ))}
    </VStack>
  );
};

const CandidateItem: React.FC<{
  candidate: CandidateResult;
  isCurrent: boolean;
}> = ({ candidate, isCurrent }) => {
  const linkDomain = candidate.url ? new URL(candidate.url).hostname : false;

  return (
    <HStack
      w="100%"
      borderStyle={"solid"}
      borderWidth={isCurrent ? "2px" : "1px"}
      borderColor={isCurrent ? "gray.400" : "gray.300"}
      borderRadius={4}
      p={2}
      spacing={2}
      align="center"
      bgColor={isCurrent ? "gray.100" : "white"}
    >
      {linkDomain ? (
        <Image
          alt={`Logo for ${candidate.name}`}
          src={`https://icon.horse/icon/${linkDomain}`}
          w={"40px"}
          borderRadius={2}
        />
      ) : (
        <Box w="40px" h="40px" borderRadius={2} bgColor={"gray.600"} />
      )}
      <VStack spacing={0} align="flex-start" flexGrow={1}>
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
      {isCurrent && <Badge colorScheme={"gray"}>Current MP</Badge>}
    </HStack>
  );
};
