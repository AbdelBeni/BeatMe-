import Stats from "../Stats/Stats";
import ComplianceLogos from "../ComplianceLogos/ComplianceLogos";
import DownloadButton from "../StartButton/SatrtButton";
import ScrollDownIndicator from "../animations/scrollDownAnimation"
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <h1 className="hero__title">
          Competitive Matches, Live Rankings, and Rivalries
          <br />
          Built for Competitive VALORANT 
        </h1>

        <div className="hero__row">
          <div className="hero__facts">
            <Stats />
            <ComplianceLogos />
          </div>
          <DownloadButton />
        </div>
      </div>
      <div className="ScrollDown-Hero">
        <ScrollDownIndicator targetId="Home" />
      </div>
    </section>
  );
}
