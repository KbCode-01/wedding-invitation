import "./WeddingLocation.css";

const address = "تالار عروسی عمان، رشت، کیلومتر هفت جاده رشت به کوچصفهان";

const maps = [
  {
    name: "Google Maps",
    subtitle: "مسیریابی با گوگل مپ",
    icon: "📍",
    url: "https://maps.app.goo.gl/np9uzCDWCuNLW3QQA",
  },
  {
    name: "نشان",
    subtitle: "مسیریابی با نشان",
    icon: "🧭",
    url: "https://nshn.ir/06_bW3U3PBiSif",
  },
  {
    name: "بلد",
    subtitle: "مسیریابی با بلد",
    icon: "🚘",
    url: "https://balad.ir/p/4DMVSXq23d8eQQ",
  },
];

function WeddingLocation() {
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      alert("آدرس با موفقیت کپی شد ❤️");
    } catch {
      alert("امکان کپی آدرس وجود ندارد.");
    }
  };

  return (
    <section className="wedding-location" dir="rtl">
      <div className="location-decoration">✿</div>

      <div className="location-heading">
        <span className="location-eyebrow">JOIN US ON OUR SPECIAL DAY</span>

        <h2>منتظر دیدارتان هستیم</h2>

        <span className="location-divider">
          <span />
          ♡
          <span />
        </span>

        <p>برای رسیدن به جشن عشق ما، مسیرتان را انتخاب کنید</p>
      </div>

      <div className="location-card">
        <div className="location-pin">📍</div>

        <span className="location-label">WEDDING VENUE</span>

        <h3>تالار عروسی عمان</h3>

        <div className="location-address">
          <span className="address-icon">⌖</span>

          <p>{address}</p>
        </div>

        <button
          className="copy-address"
          onClick={copyAddress}
          type="button"
        >
          <span>▣</span>
          کپی آدرس
        </button>

        <div className="location-separator">
          <span />
          <span>انتخاب مسیریاب</span>
          <span />
        </div>

        <div className="map-options">
          {maps.map((map) => (
            <a
              key={map.name}
              href={map.url}
              target="_blank"
              rel="noopener noreferrer"
              className="map-option"
            >
              <span className="map-option-icon">{map.icon}</span>

              <span className="map-option-text">
                <strong>{map.name}</strong>
                <small>{map.subtitle}</small>
              </span>

              <span className="map-arrow">←</span>
            </a>
          ))}
        </div>

        <div className="location-footer">
          <span>WITH LOVE</span>
          <span>♡</span>
          <span>SASAN & ANAHITA</span>
        </div>
      </div>

      <div className="location-bottom-flower">❀</div>
    </section>
  );
}

export default WeddingLocation;