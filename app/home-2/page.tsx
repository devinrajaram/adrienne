import { BioSection } from "../components/bio-section";
import { Hero } from "../components/hero";
import { PracticeSection } from "../components/practice-section";

export default function Home2() {
  return (
    <main className="relative">
      <Hero fixedHeightPx={820} extraBottomPx={140} />
      <BioSection compact />
      <div className="relative z-0">
        <PracticeSection />
      </div>
    </main>
  );
}
