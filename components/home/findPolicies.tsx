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
} from "@chakra-ui/react";
import axios from "axios";
import { GroupBase, OptionBase, Select } from "chakra-react-select";
import React, { useEffect } from "react";
import { Card } from "../layout/card";
import { SideBySide } from "../layout/sideBySide";
import { useUserContext } from "../userContext";
import { PolicySupportResult } from "../../pages/api/policySupport/[id]";

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
            Search for policies that concern you and see how each party stacks
            up
          </Text>
          <HStack>
            <Image
              alt="They Vote For You logo"
              w="30px"
              borderRadius={"100%"}
              src="https://pbs.twimg.com/profile_images/524727105339154432/_PARXiYC_400x400.png"
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
    label: i.name.charAt(0).toUpperCase() + i.name.slice(1),
    value: i.id,
    description: i.description,
  }));

  const [policy, setPolicy] = React.useState<PolicyItem | null>(null);

  return (
    <VStack align="stretch">
      <Select<PolicyItem, false, GroupBase<PolicyItem>>
        id="policy-select"
        name="policy"
        options={policies}
        placeholder="Search for a policy..."
        onChange={(value) => setPolicy(value)}
      />
      <Divider />
      {policy ? (
        <VStack spacing={4}>
          <Card px={4} py={4}>
            <VStack align="flex-start">
              <Text color="gray.600">{policy.description}.</Text>
            </VStack>
          </Card>
          <Box minH="100px">
            <PolicySupport policyId={policy.value} />
          </Box>
        </VStack>
      ) : (
        <Text>Select a policy above to see how the parties compare</Text>
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

  const results = candidates
    .map((c) => {
      const support = policySupport.find((ps) => ps.party === c.party);
      return {
        party: c.party,
        support: support?.support || undefined,
      };
    })
    .sort((a, b) => b.support - a.support);

  return (
    <VStack align="flex-start">
      {results.map((i) => (
        <Text key={i.party}>
          <SupportBadge support={i.support} /> {i.party}
        </Text>
      ))}
    </VStack>
  );
};

async function getPolicySupport(policyId: number) {
  const response = await axios.get<PolicySupportResult[]>(
    `api/policySupport/${policyId}`
  );
  console.log(response.data);
  return response.data;
}

const SupportBadge: React.FC<{ support: number }> = ({ support }) => {
  if (support === undefined) {
    return (
      <Badge colorScheme="gray" variant="outline">
        N/A
      </Badge>
    );
  }

  switch (true) {
    case support < 25:
      return <Badge colorScheme={"red"}>{support}%</Badge>;
    case support < 50:
      return <Badge colorScheme={"orange"}>{support}%</Badge>;
    case support < 75:
      return <Badge colorScheme={"yellow"}>{support}%</Badge>;
    case support < 101:
      return <Badge colorScheme={"green"}>{support}%</Badge>;
    default:
      return <Badge>{support}%</Badge>;
  }
};
