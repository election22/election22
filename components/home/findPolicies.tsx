import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Heading,
  VStack,
  Input,
  HStack,
  Divider,
  Wrap,
  Tag,
  Text,
  Image,
  Button,
  Box,
  Link,
  Spinner,
  Badge,
  Center,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { GroupBase, OptionBase, Select } from "chakra-react-select";
import React, { useEffect } from "react";
import { PolicySupportResult } from "../../services/theyVoteForYou";
import { EmptyMessage } from "../emptyMessage";
import { Card } from "../layout/card";
import { SideBySide } from "../layout/sideBySide";
import { useUserContext } from "../userContext";

interface PolicyItem extends OptionBase {
  label: string;
  value: number;
  description: string;
}

export const FindPolicies: React.FC = () => {
  return (
    <SideBySide
      boxProps={{
        bgColor: "orange.200",
      }}
      left={
        <>
          <Heading>2. See how they vote</Heading>
          <Text>
            Search for policies that you care about, and see where each party
            stands on them.
          </Text>
          <HStack>
            <Image
              alt="They Vote For You logo"
              w="30px"
              borderRadius={"100%"}
              src="tvfy-logo.png"
            />
            <Text fontSize={"small"}>
              Policies provided by{" "}
              <Link href="https://theyvoteforyou.org.au" target="_blank">
                theyvoteforyou.org.au
              </Link>
            </Text>
          </HStack>
        </>
      }
      right={
        <Card>
          <PolicyViewer />
        </Card>
      }
    ></SideBySide>
  );
};

const PolicyViewer: React.FC = () => {
  const { policies: rawPolicies, electorate, candidates } = useUserContext();
  const policies: PolicyItem[] = rawPolicies.map((i) => ({
    label: i.name,
    value: i.id,
    description: i.description,
  }));

  const [policy, setPolicy] = React.useState<PolicyItem | null>(null);

  return (
    <VStack align="stretch">
      <FormControl>
        <FormLabel>Select a policy to view:</FormLabel>
        <Select<PolicyItem, false, GroupBase<PolicyItem>>
          id="policy-select"
          name="policy"
          options={policies}
          placeholder="Search for a policy..."
          onChange={(value) => setPolicy(value)}
        />
      </FormControl>
      <Divider />
      {policy ? (
        <VStack spacing={4}>
          <Card px={4} py={4}>
            <VStack align="flex-start">
              <Heading size="md">{policy.label}</Heading>
              <Text color="gray.600">{policy.description}</Text>
              <Divider />
              <Link
                fontSize={"smaller"}
                isExternal
                href={`https://theyvoteforyou.org.au/policies/${policy.value}`}
              >
                View more details about this policy <ExternalLinkIcon />
              </Link>
            </VStack>
          </Card>
          <Box minH="100px">
            <PolicySupport policyId={policy.value} />
          </Box>
        </VStack>
      ) : (
        <EmptyMessage>
          <Text color="gray.400">
            Select a policy above to see how the parties compare
          </Text>
        </EmptyMessage>
      )}
    </VStack>
  );
};

const PolicySupport: React.FC<{ policyId: number }> = ({ policyId }) => {
  const { candidates } = useUserContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [policySupport, setPolicySupport] = React.useState<
    PolicySupportResult[]
  >([]);

  useEffect(() => {
    if (policyId) {
      setIsLoading(true);
      getPolicySupport(policyId).then((result) => {
        setPolicySupport(result);
        setIsLoading(false);
      });
    }
  }, [policyId]);

  if (isLoading) {
    return (
      <Center h="100px">
        <Spinner />
      </Center>
    );
  }

  const partiesWithSupportRecords = policySupport
    .filter((s) => candidates.find((c) => c.party === s.party))
    .sort((a, b) => {
      if (b.support === undefined) {
        return -1;
      }
      return b.support - a.support;
    });

  const partiesWithoutSupportRecords = candidates.filter(
    (c) => !policySupport.find((s) => (s.party === c.party ? true : false))
  );

  return (
    <VStack align="flex-start">
      {partiesWithSupportRecords.map((i) => (
        <Text key={i.party}>
          <SupportBadge support={i.support} /> {i.party}
        </Text>
      ))}
      <Divider />
      {partiesWithoutSupportRecords.map((i) => (
        <Text key={i.party}>
          <Badge variant="outline" w="40px" colorScheme={"gray"}>
            N/A
          </Badge>{" "}
          {i.party}
        </Text>
      ))}
    </VStack>
  );
};

async function getPolicySupport(policyId: number) {
  const response = await axios.get<PolicySupportResult[]>(
    `api/policySupport/${policyId}`
  );
  return response.data;
}

const SupportBadge: React.FC<{ support: number }> = ({ support }) => {
  const badgeColor = getBadgeColor(support);
  return (
    <Badge w="40px" colorScheme={badgeColor}>
      {`${support}%`}
    </Badge>
  );
};

function getBadgeColor(support: number) {
  switch (true) {
    case support < 25:
      return "red";
    case support < 50:
      return "orange";
    case support < 75:
      return "yellow";
    case support < 101:
      return "green";
    default:
      return "blue";
  }
}
