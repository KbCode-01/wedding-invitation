
import { useEffect, useState } from "react";
import "./App.css";
import GlassReveal from "./GlassReveal";
import PhotoSlider from "./PhotoSlider";
import WeDoTimeline from "./WeDoTimeline";
import WeddingLocation from "./WeddingLocation";
import AttendanceForm from "./AttendanceForm";
import Admin from "./Admin";

// تاریخ مراسم: سه‌شنبه ۳ آذر ۱۴۰۵، ساعت ۱۸:۰۰ به وقت ایران
const weddingDate = new Date("2026-11-24T18:00:00+03:30").getTime();

const toPersianNumber = (number) =>
  String(number).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: "۰۰",
    hours: "۰۰",
    minutes: "۰۰",
  });

  useEffect(() => {
    const updateCountdown = () => {
      const difference = Math.max(0, weddingDate - Date.now());

      const days = Math.floor(difference / 86400000);
      const hours = Math.floor((difference % 86400000) / 3600000);
      const minutes = Math.floor((difference % 3600000) / 60000);

      setTimeLeft({
        days: toPersianNumber(String(days).padStart(2, "0")),
        hours: toPersianNumber(String(hours).padStart(2, "0")),
        minutes: toPersianNumber(String(minutes).padStart(2, "0")),
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // مسیر اختصاصی پنل مدیریت
  if (window.location.pathname.replace(/\/+$/, "") === "/admin") {
    return <Admin />;
  }

  return (
    <main className="invitation">
      {/* بخش اصلی دعوت‌نامه */}
      <section className="hero">
        <p className="eyebrow">A SPECIAL DAY · A BEAUTIFUL BEGINNING</p>

        <div className="ornament">✧</div>

        <p className="invitation-text">به نام عشق</p>

        <img src="/weddinf.png" alt="Wedding" />

        <div className="name_box">
          <section className="nameItems">
            <br />
            <p className="glow">S a s a n</p>
            <br />
            <p className="glow">&</p>
            <p className="glow">A n a h i t a</p>
            <br />
            <h6>علیزاده - رفیعی</h6>
          </section>
        </div>
      </section>

      {/* تصویر زوج */}
      <div className="imageBox">
        <img className="blob" src="/gid01.gif" alt="Wedding couple" />
      </div>

      {/* شمارش معکوس */}
      <div className="timeCounter">
        <GlassReveal>
          <div className="countdown" dir="ltr">
            <div className="count-box colorful-bg">
              <strong>{timeLeft.days}</strong>
              <span>روز</span>
            </div>

            <div className="count-box colorful-bg">
              <strong>{timeLeft.hours}</strong>
              <span>ساعت</span>
            </div>

            <div className="count-box colorful-bg">
              <strong>{timeLeft.minutes}</strong>
              <span>دقیقه</span>
            </div>
          </div>
        </GlassReveal>

        <img
          className="img1"
          src="/Pink Floral Vine Corner Frame.png"
          alt=""
        />

        <img
          className="img2"
          src="/Pink Floral Vine Corner Frame.png"
          alt=""
        />
      </div>

      {/* باکس شعر */}
      <div className="pomeBox"></div>

      {/* باکس تاریخ و تقویم */}
      <div className="dateBox">
        <div className="taj">
          <span className="cart1"></span>
          <span className="cart2"></span>
          <span className="cart3"></span>
        </div>

        <div className="textBox">
          <p>سه شنبه ۳ آذر ۱۴۰۵</p>
          <p>ساعت ۱۸:۰۰ الی ۲۴:۰۰</p>
          <p>به صرف شیرینی و شام</p>
        </div>

        <div className="calendeBox">
          <img className="clbox1" src="/ghoo.png" alt="" />
          <img className="clbox2" src="/azar02.png" alt="" />
        </div>

        <div className="slider">
          <PhotoSlider />
        </div>

        <div className="wave">
          <WeDoTimeline />
        </div>

        <div className="location">
          <WeddingLocation />
        </div>

        <div className="lastpart">
          <AttendanceForm />
        </div>
      </div>
    </main>
  );
}

export default App;
