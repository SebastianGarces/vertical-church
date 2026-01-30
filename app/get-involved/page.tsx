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
      <main>
        <PageIntro />
        <NextSteps />
        <Ministries />
        <SmallGroups />
        <Marquee />
        <ServeTeams />
      </main>
      <Footer />
    </div>
  );
}
