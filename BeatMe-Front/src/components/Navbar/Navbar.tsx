import { Zap } from "lucide-react";
import GameTabs from "../GameTabs/GameTabs";
import SearchBar from "../SearchBar/SearchBar";
import NavActions from "../NavActions/NavActions";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__top">
        <a href="/" className="navbar__logo">
          <div className="navbar__logo_content">
            <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" viewBox="0 0 1024 1024"><path fill="currentcolor" d="M 569.5 213 L 773 213.5 L 750.5 237 Q 748.3 236.3 749 238.5 L 624.5 364 Q 622.3 363.3 623 365.5 L 618.5 370 L 617 370 L 617 371.5 L 520.5 468 L 482.5 468 L 481.5 469 L 315.5 469 L 312.5 468 L 312 468.5 L 648 804.5 L 647.5 805 L 645.5 806 L 440.5 806 L 311 668.5 L 311 468.5 L 334.5 445 L 336 445 L 338.5 441 Q 340.8 441.8 340 439.5 L 351 429.5 L 353.5 426 L 364 416.5 L 365.5 414 Q 367.8 414.8 367 412.5 L 373 407.5 L 375.5 404 Q 377.8 404.8 377 402.5 L 384 396.5 L 386.5 393 Q 388.8 393.8 388 391.5 L 393 388 Q 391.9 385.3 394.5 386 L 426.5 353 L 450 330.5 Q 449.3 328.3 451.5 329 L 566.5 214 L 569.5 213 Z"/></svg>
            <span>BEETME</span>
          </div>
        </a>
        <GameTabs />
      </div>
      <div className="navbar__bottom">
        <SearchBar />
        <NavActions />
      </div>
    </header>
  );
}
