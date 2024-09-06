import { useGetTokenChunkQuery } from "@/redux/slices/apiSlice";
import Image from "next/image";
import Game from "./components/Game";

export default async function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <Game />
    </div>
  );
}
