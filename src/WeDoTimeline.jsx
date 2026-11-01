import { useEffect, useRef, useState } from "react";
import "./WeDoTimeline.css";

const items = [
  { title: "We Do", subtitle: "The beginning of forever", icon: "rings" },
  { title: "We Drink", subtitle: "A toast to our love", icon: "drink" },
  { title: "We Eat", subtitle: "A taste of happiness", icon: "eat" },
  { title: "We Party", subtitle: "Let's celebrate together", icon: "party" },
];

function Icon({ type }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="wedo-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === "rings" && (
        <>
          <circle cx="39" cy="55" r="23" />
          <circle cx="61" cy="55" r="23" />
          <path d="M50 25 C34 12 43 2 50 15 C58 1 69 12 50 25Z" />
          <path d="M28 34 L23 28 M72 34 L77 28" />
        </>
      )}

      {type === "drink" && (
        <>
          <path d="M27 20 H73 L65 53 Q62 65 50 65 Q38 65 35 53 Z" />
          <path d="M50 65 V83 M36 86 H64" />
          <path d="M36 38 Q50 46 65 38" />
          <path d="M67 10 L82 2" />
          <path d="M75 20 L84 15" />
          <circle cx="39" cy="30" r="2" />
        </>
      )}

      {type === "eat" && (
        <>
          <path d="M17 57 A33 33 0 0 1 83 57 Z" />
          <path d="M13 62 H87 Q90 62 90 66 Q90 70 87 70 H13 Q10 70 10 66 Q10 62 13 62Z" />
          <path d="M50 24 V57" />
          <path d="M36 34 L50 24 L64 34" />
          <path d="M24 46 H76" />
          <path d="M50 12 V18" />
        </>
      )}

      {type === "party" && (
        <>
          <path d="M50 14 L57 40 L84 31 L66 53 L88 70 L60 67 L50 94 L40 67 L12 70 L34 53 L16 31 L43 40 Z" />
          <circle cx="50" cy="53" r="10" />
          <path d="M15 12 L20 20 M85 12 L80 20 M50 2 V10" />
          <path d="M5 47 H14 M86 47 H95" />
        </>
      )}
    </svg>
  );
}

export default function WeDoTimeline() {
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();

      const total = rect.height + window.innerHeight;
      const traveled = window.innerHeight - rect.top;

      const amount = Math.max(
        0,
        Math.min(1, traveled / total)
      );

      setProgress(amount);

      const center = window.innerHeight * 0.5;
      let nearest = -1;
      let distance = Infinity;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;

        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const currentDistance = Math.abs(itemCenter - center);

        if (currentDistance < distance) {
          distance = currentDistance;
          nearest = index;
        }
      });

      setActive(
        distance < window.innerHeight * 0.48 ? nearest : -1
      );

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const branchPath =
  "M50 0 C50 100 15 120 50 230 C85 340 85 360 50 470 C15 580 15 600 50 710 C85 820 85 840 50 950";
  return (
    <section className="wedo-timeline" ref={sectionRef}>
      <div className="wedo-heading">
        <span className="wedo-eyebrow">OUR SPECIAL DAY</span>
        <h2>And so the celebration begins</h2>
        <span className="wedo-heading-flower">✿</span>
      </div>

      <div className="wedo-branch-wrap">
        <svg
          className="wedo-branch"
          viewBox="0 0 100 950"
          preserveAspectRatio="none"
        >
          <path className="branch-base" d={branchPath} />

          <path
            className="branch-progress"
            d={branchPath}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - progress}
          />
        </svg>
      </div>

      <div className="wedo-items">
        {items.map((item, index) => (
          <div
            key={item.title}
            ref={(el) => (itemRefs.current[index] = el)}
            className={`wedo-row row-${index + 1} ${
              active === index ? "active" : ""
            } ${active > index ? "completed" : ""}`}
          >
            <div className="wedo-content">
              <div className="wedo-icon-frame">
                <span className="wedo-icon-glow" />
                <Icon type={item.icon} />
              </div>

              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <span className="wedo-number">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="wedo-bottom">
        <span>WITH LOVE</span>
        <span className="wedo-bottom-heart">♡</span>
        <span>SASAN & ANAHITA</span>
      </div>
    </section>
  );
}