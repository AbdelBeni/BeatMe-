import "./Stats.css";

export default function Stats() {
  return (
    <div className="stats">
        <div className="statsContainer">
          <div className="stats__item">
            <strong>240M+</strong>
            <span>Players</span>
          </div>
        </div>
        <div>
              <span className="inBettwenStats"></span>
          </div>
        <div className="statsContainer">
          <div className="stats__item">
            <strong>3B+</strong>
            <span>Matches Analyzed</span>
          </div>
        </div>
        <div>
              <span className="inBettwenStats"></span>
        </div>
    </div>
  );
}
