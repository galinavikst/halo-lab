import Game from "./components/Game";
import UserBlock from "./components/UserBlock";
import { Toaster } from "react-hot-toast";

export default async function Home() {
  return (
    <div className="min-h-screen flex gap-3 p-8 font-[family-name:var(--font-geist-sans)]">
      <UserBlock />
      <Game />
      <Toaster />
    </div>
  );
}
