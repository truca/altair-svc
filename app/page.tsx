import { Direction } from "@/stories/Form/types";
import { Layout } from "@/stories/Layout";

export default function Home() {
  const news = true;
  if (news) {
    return (
      <Layout
        layout={{
          type: "dashboardLayout",
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
                          "São apenas três passos para criar seu Stude Plan. *Vamos lá?*",
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
                            marginBottom: "16px",
                          },
                        },
                        {
                          type: "smartform",
                          props: {
                            direction: Direction.COLUMN,
                            entityType: "AUTHOR",
                            submitText: "Próximo",
                            submitProps: {
                              colorScheme: "pink",
                              alignSelf: "flex-end",
                              background: "#7D40FF",
                              color: "white",
                              marginTop: "20px",
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
}
