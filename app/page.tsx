import { Direction } from "@/stories/Form/types";
import { Layout } from "@/stories/Layout";
import UserData from "./components/UserData";
import { getLayoutElements } from "@/stories/Layout/useLayoutElements";

interface CardFormWithTitleProps {
  title: string;
  entityType: string;
  submitText: string;
  submitProps?: any;
}

export default function Home() {
  const news = true;
  if (news) {
    return (
      <>
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
        <UserData />
      </>
    );
  }
}
