import { ChakraProvider } from "@chakra-ui/react";
import { useEffect } from "react";
import { UserContextProvider } from "../components/userContext";
import { theme } from "../theme";
import TagManager from "react-gtm-module";

const TagManagerId = process.env.NEXT_PUBLIC_GTM_ID;

function MyApp({ Component, pageProps }) {
  // init in useEffect so it only runs client-side
  useEffect(() => {
    if (TagManagerId) {
      TagManager.initialize({ gtmId: TagManagerId });
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
