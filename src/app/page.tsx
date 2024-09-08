import Rules from "../components/Rules";
import ScoreBoard from "../components/ScoreBoard";
import UserBlock from "../components/UserBlock";

export default function Home() {
  return (
    <div className="min-h-screen justify-center flex gap-3 p-8 font-[family-name:var(--font-geist-sans)]">
      <div>
        <UserBlock />
        <Rules />
      </div>
      <ScoreBoard />
    </div>
  );
}
