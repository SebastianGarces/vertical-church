import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Marquee } from "../components/Marquee";
import {
  PageIntro,
  NextSteps,
  Ministries,
  SmallGroups,
  ServeTeams,
} from "./components";

export default function GetInvolvedPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="pb-16 md:pb-24">
        <PageIntro />
        <NextSteps />
        <Ministries />
        <Marquee />
        <SmallGroups />
        <ServeTeams />
      </main>
      <Footer />
    </div>
  );
}
