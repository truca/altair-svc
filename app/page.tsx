import { Direction } from "@/stories/Form/types";
import { Layout } from "@/stories/Layout";

export default function Home() {
  return (
    <Layout
      layout={{
        type: "grid",
        props: {
          minHeight: "100vh",
          gridTemplateAreas: `"sidebar header"
    "sidebar content"`,
          gridTemplateColumns: "255px 1fr",
          gridTemplateRows: "64px 1fr",
        },
        items: [
          {
            type: "flex",
            props: {
              flexDirection: "column",
              padding: "20px 8px 20px 36px",
              gap: "16px",
              gridArea: "sidebar",
            },
            items: [
              {
                type: "img",
                props: {
                  src: "/logo.svg",
                  width: 95,
                  height: 50,
                },
              },
              {
                type: "flex",
                props: {
                  gap: "12px",
                  alignItems: "center",
                },
                items: [
                  {
                    type: "img",
                    props: {
                      fontSize: "20px",
                      fontWeight: "bold",
                      width: 20,
                      height: 20,
                      src: "/mage-hat.svg",
                    },
                  },
                  {
                    type: "text",
                    props: {
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#EB42BE",
                      children: "Criando seu Stude Plan",
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "flex",
            props: {
              padding: "16px",
              justifyContent: "flex-end",
              gap: "16px",
              gridArea: "header",
            },
          },
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
                    type: "flex",
                    props: {
                      backgroundColor: "#FFFFFF",
                      padding: "16px 32px 24px",
                      borderRadius: "8px",
                      width: "950px",
                      flexDirection: "column",
                    },
                    items: [
                      {
                        type: "text",
                        props: {
                          children: "Sobre o Stude Plan",
                          fontSize: "20px",
                          lineHeight: "40px",
                          fontWeight: "600",
                          color: "#111827",
                          width: "100%",
                          paddingBottom: "10px",
                          borderBottom: "1px solid #E5E7EB",
                          marginBottom: "32px",
                        },
                      },
                      {
                        type: "smartform",
                        props: {
                          direction: Direction.COLUMN,
                          entityType: "STUDYPLAN",
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
