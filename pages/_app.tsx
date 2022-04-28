import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { UserContextProvider } from "../components/userContext";
import { theme } from "../theme";
import TagManager from "react-gtm-module";

const TagManagerId = process.env.NEXT_PUBLIC_GTM_ID;
console.log(`OG GTM ID: ${TagManagerId}`);

function MyApp({ Component, pageProps }) {
  // init in useEffect so it only runs client-side
  useEffect(() => {
    if (TagManagerId) {
      console.log(`Init GTM with id ${TagManagerId}`);
      TagManager.initialize({ id: TagManagerId });
    } else {
      console.log(`No GTM ID found`);
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
