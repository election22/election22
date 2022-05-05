import {
  Heading,
  VStack,
  Text,
  Image,
  FormControl,
  FormLabel,
  HStack,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { Card } from "../layout/card";
import { SideBySide } from "../layout/sideBySide";
import { LocalitySearch } from "../localitySearch";
import { useUserContext } from "../userContext";
import { ElectorateDetails } from "../../types/electorate";
import { ElectorateInfo } from "../electorateDetails";

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
  const { setElectorate, electorate, electorateDetails, setElectorateDetails } =
    useUserContext();
  const [isLoadingElectorate, setIsLoadingElectorate] = React.useState(false);

  useEffect(() => {
    if (electorate) {
      setIsLoadingElectorate(true);
      getCandidatesForElectorate(electorate).then((details) => {
        setElectorateDetails(details);
        setIsLoadingElectorate(false);
      });
    }
  }, [electorate]);

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

      <ElectorateInfo
        name={electorate}
        electorateDetails={electorateDetails}
        isLoading={isLoadingElectorate}
      />
    </VStack>
  );
};

async function getCandidatesForElectorate(electorate: string) {
  const res = await axios.get<ElectorateDetails>(
    `api/electorate/${electorate}`
  );
  return res.data;
}
