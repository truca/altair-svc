import Image from "next/image";
import { getLayoutElements } from "../Layout/useLayoutElements";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: string[];
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
          padding: "20px 8px 20px 25px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        <Image src="/logo.svg" alt="logo" width={95} height={50} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {getLayoutElements(sidebarItems as any)}
        </div>
      </div>
      <div
        style={{
          gridArea: "header",
          padding: "16px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "16px",
          alignItems: "center",
        }}
      >
        {headerItems && getLayoutElements(headerItems as any)}
      </div>

      {children}
    </div>
  );
}

export default DashboardLayout;
