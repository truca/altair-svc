import Image from "next/image";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: React.ReactNode[];
  headerItems: React.ReactNode[];
}

function DashboardLayout({
  headerItems,
  sidebarItems,
  children,
}: DashboardLayoutProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "255px 1fr",
        gridTemplateRows: "64px 1fr",
        gridTemplateAreas: `
          "sidebar header"
          "sidebar content"
        `,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          gridArea: "sidebar",
          padding: "20px 8px 20px 36px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {sidebarItems ? (
          <>{sidebarItems}</>
        ) : (
          <>
            <Image src="/logo.svg" alt="logo" width={95} height={50} />
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Image
                src="/mage-hat.svg"
                alt="mage-hat"
                width={20}
                height={20}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#EB42BE",
                }}
              >
                Criando seu Stude Plan
              </span>
            </div>
          </>
        )}
      </div>
      <div
        style={{
          gridArea: "header",
          padding: "16px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "16px",
        }}
      >
        {headerItems}
      </div>

      {children}
    </div>
  );
}

export default DashboardLayout;
