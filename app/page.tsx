import API from "./components/API";
import Counter from "./components/Counter";
import Drawer from "./components/Drawer";
import Link from "./components/Link";
import Modal from "./components/Modal";
import ToastExample from "./components/Toast";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Counter />
      <Link href="/aboutt">Go to About</Link>
      <ToastExample />
      <Modal />
      <Drawer />
      <API />
    </main>
  );
}
