import ScoreBoard from "./components/ScoreBoard";
import UserBlock from "./components/UserBlock";

export default function Home() {
  return (
    <div className="min-h-screen justify-center flex gap-3 p-8 font-[family-name:var(--font-geist-sans)]">
      <UserBlock />
      <ScoreBoard />
    </div>
  );
}
