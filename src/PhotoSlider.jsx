

import { useEffect, useRef, useState } from "react";
import "./PhotoSlider.css";

const photos = [
  "/photo1.png",
  "/photo2.jpg",
  "/photo4.png",
  "/phot3.png",
  "/photo5.jpg",
];

function PhotoSlider() {
  const [active, setActive] = useState(2);
  const trackRef = useRef(null);
  const itemRefs = useRef([]);

  const centerPhoto = (index, behavior = "smooth") => {
    const track = trackRef.current;
    const item = itemRefs.current[index];

    if (!track || !item) return;

    track.scrollTo({
      left:
        item.offsetLeft -
        (track.clientWidth - item.offsetWidth) / 2,
      behavior,
    });
  };

  useEffect(() => {
    centerPhoto(2, "instant");
  }, []);

  const move = (direction) => {
    const next = Math.max(
      0,
      Math.min(photos.length - 1, active + direction)
    );

    setActive(next);
    centerPhoto(next);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const center = track.scrollLeft + track.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(center - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActive(closestIndex);
  };

  return (
    <div className="photo-slider">
      <button
        className="slider-btn prev"
        onClick={() => move(-1)}
        disabled={active === 0}
      >
        ❮
      </button>

      <div
        className="photo-track"
        ref={trackRef}
        onScroll={handleScroll}
      >
        {photos.map((photo, index) => (
          <div
            key={photo}
            ref={(el) => (itemRefs.current[index] = el)}
            className={`photo-item ${
              active === index ? "active" : ""
            }`}
            onClick={() => {
              setActive(index);
              centerPhoto(index);
            }}
          >
            <img src={photo} alt={`عکس ${index + 1}`} />
          </div>
        ))}
      </div>

      <button
        className="slider-btn next"
        onClick={() => move(1)}
        disabled={active === 4}
      >
        ❯
      </button>
    </div>
  );
}

export default PhotoSlider;
