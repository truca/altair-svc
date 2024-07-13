import Drawer from "./components/Drawer";
import Link from "./components/Link";
import Modal from "./components/Modal";
import ToastExample from "./components/Toast";
import SmartForm from "../stories/SmartForm";
import { Direction } from "@/stories/Form/types";
import UserProfile from "./components/ssr/UserProfile";
import HomeComponent from "./components/Home";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/aboutt">Go to About</Link>
      <ToastExample />
      <Modal />
      <Drawer />
      {/* Example Client component */}
      <HomeComponent />
      {/* Example SSR component */}
      <UserProfile />
      <SmartForm
        id="665d1cf715dbe844897f0b59"
        entityType="BOOK"
        debug={false}
        direction={Direction.COLUMN}
        commonFieldProps={{
          inputProps: { colorScheme: "red" } as any,
        }}
      />
    </main>
  );
}
