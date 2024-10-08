import { Layout } from "@/stories/Layout";

import { ReactNode } from "react";
import { Box, Flex, IconButton } from "@chakra-ui/react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [isMobile, setIsMobile] = useState(false); // Optional state if you'd like to detect mobile explicitly
  const isOpen = true;
  const onOpen = () => {};
  const onClose = () => {};

  return (
    <Flex direction="column" className="h-screen w-full">
      {/* Header */}
      <Flex
        as="header"
        alignItems="center"
        justifyContent="space-between"
        bg="blue.500" /* Chakra for color */
        className="p-4 shadow-md"
      >
        <Box className="text-white text-lg font-bold">My Header</Box>
        {/* Hamburger for Mobile */}
        <IconButton
          display={{ base: "block", md: "none" }}
          icon={isOpen ? <span>close</span> : <span>open</span>}
          // onClick={isOpen ? onClose : onOpen}
          variant="ghost"
          aria-label="Toggle Navigation"
          color="white"
        />
      </Flex>

      <Flex className="h-full">
        {/* Sidebar */}
        <Box
          as="nav"
          display={{ base: isOpen ? "block" : "none", md: "block" }}
          bg="blue.500" /* Same color as header */
          className="w-64 p-4 text-white h-full"
          position={{ base: "fixed", md: "relative" }}
          left={0}
          zIndex={10}
        >
          <Box className="mb-4 font-bold">Sidebar</Box>
          <Box>Link 1</Box>
          <Box>Link 2</Box>
          <Box>Link 3</Box>
        </Box>

        {/* Content */}
        <Box
          as="main"
          className="flex-1 p-4 bg-gray-100 flex items-center justify-center"
        >
          <Box
            bg="white"
            p={6}
            boxShadow="md"
            rounded="md"
            className="w-full max-w-3xl"
          >
            {children}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default function Home() {
  const news = false;
  if (news) {
    return (
      <Layout
        layout={{
          type: "dashboardLayout",
          props: {
            sidebarItems: [
              {
                type: "text",
                props: {
                  children: "{i|FaHatWizard} Criando seu Stude Plan",
                  fontSize: "16px",
                  lineHeight: "16px",
                  color: "#EB42BE",
                  display: "flex",
                  gap: 2,
                  cursor: "pointer",
                  fontWeight: "600",
                  marginBottom: "16px",
                },
              },
              {
                type: "text",
                props: {
                  children: "{i|FaArrowDownWideShort} Criando seu Stude Plan",
                  fontSize: "16px",
                  lineHeight: "16px",
                  display: "flex",
                  gap: 2,
                  cursor: "pointer",
                  fontWeight: "400",
                },
              },
              {
                type: "text",
                props: {
                  children: "{i|FaBell} Criando seu Stude Plan",
                  fontSize: "16px",
                  lineHeight: "16px",
                  display: "flex",
                  gap: 2,
                  cursor: "pointer",
                  fontWeight: "400",
                },
              },
            ],
            headerItems: [{ type: "headerUser" }],
          },
          items: [
            {
              type: "flex",
              props: {
                flexDirection: "column",
                padding: "16px",
                backgroundColor: "#F3F4F6",
                gridArea: "content",
              },
              items: [
                {
                  type: "flex",
                  props: {
                    flexDirection: "column",
                    gap: "16px",
                    alignItems: "flex-start",
                    margin: "0 auto",
                    marginTop: "48px",
                  },
                  items: [
                    {
                      type: "text",
                      props: {
                        children: "Olá, Robério",
                        fontSize: "28px",
                        fontWeight: "600",
                        lineHeight: "140%",
                        color: "#718096",
                      },
                    },
                    {
                      type: "text",
                      props: {
                        children:
                          "São apenas três passos para criar seu Stude Plan. Vamos lá?",
                        fontSize: "38px",
                        fontWeight: "600",
                        lineHeight: "140%",
                        color: "black",
                        maxWidth: "920px",
                      },
                    },
                    {
                      type: "card",
                      props: {
                        padding: "16px 32px 24px",
                        w: "100%",
                      },
                      items: [
                        {
                          type: "formWithTitle",
                          props: {
                            title: "Sobre o Stude Plan",
                            formProps: {
                              entityType: "AUTHOR",
                              submitText: "Próximo",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />
    );
  }

  return <DashboardLayout>Dashboard Content</DashboardLayout>;
}
