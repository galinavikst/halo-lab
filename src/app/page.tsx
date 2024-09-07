import { useGetTokenChunkQuery } from "@/redux/slices/apiSlice";
import Image from "next/image";
import Game from "./components/Game";
import UserBlock from "./components/UserBlock";

export default async function Home() {
  return (
    <div className="min-h-screen flex gap-3 p-8 font-[family-name:var(--font-geist-sans)]">
      <UserBlock />
      <Game />
    </div>
  );
}
