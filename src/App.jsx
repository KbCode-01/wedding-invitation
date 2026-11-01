
import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./EnvelopeIntro.css";

import GlassReveal from "./GlassReveal";
import PhotoSlider from "./PhotoSlider";
import WeDoTimeline from "./WeDoTimeline";
import WeddingLocation from "./WeddingLocation";
import AttendanceForm from "./AttendanceForm";
import Admin from "./Admin";

const weddingDate = new Date("2026-11-24T18:00:00+03:30").getTime();

const toPersianNumber = (number) =>
  String(number).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: "۰۰",
    hours: "۰۰",
    minutes: "۰۰",
  });

  const [introDone, setIntroDone] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [musicPrompt, setMusicPrompt] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);

  const audioRef = useRef(null);
  const introFinishedRef = useRef(false);

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

  // مسیر پنل مدیریت
  if (window.location.pathname.replace(/\/+$/, "") === "/admin") {
    return <Admin />;
  }

  // پایان و محو شدن ویدیوی آغازین
  const finishIntro = () => {
    if (introFinishedRef.current) return;

    introFinishedRef.current = true;
    setIsFading(true);

    setTimeout(() => {
      setIntroDone(true);
      setMusicPrompt(true);
    }, 900);
  };

  // رد کردن موسیقی
  const skipMusic = () => {
    setMusicPrompt(false);
    setShowInvitation(true);
  };

  // پخش موسیقی با اجازه کاربر
  const playMusic = async () => {
    if (!audioRef.current) return;

    try {
      setAudioError(false);
      await audioRef.current.play();

      setMusicPlaying(true);
      setMusicPrompt(false);
      setShowInvitation(true);
    } catch (error) {
      console.error("Music playback error:", error);
      setAudioError(true);
    }
  };

  // کنترل پخش و توقف موسیقی
  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      await playMusic();
    }
  };

  return (
    <>
      {/* موسیقی پس‌زمینه */}
      <audio
        ref={audioRef}
        src="/wedding-music.mp3"
        loop
        preload="none"
      />

      {/* ویدیوی آغازین تمام صفحه */}
      {!introDone && (
        <div
          className={`video-intro ${isFading ? "video-intro-fade" : ""}`}
        >
          <video
            className="intro-video"
            src="/wedding-intro.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={finishIntro}
            onError={finishIntro}
          />
        </div>
      )}

      {/* درخواست اجازه پخش موسیقی */}
      {musicPrompt && (
        <div className="music-overlay">
          <div className="music-modal" dir="rtl">
            <div className="music-icon">♫</div>

            <h2>لحظاتی با موسیقی عشق</h2>

            <p>
              دوست دارید هنگام مشاهده دعوت‌نامه،
              موسیقی ملایمی برایتان پخش شود؟
            </p>

            {audioError && (
              <p className="audio-error">
                فایل موسیقی هنوز اضافه نشده یا قابل پخش نیست.
              </p>
            )}

            <button className="music-yes" onClick={playMusic}>
              بله، با کمال میل
            </button>

            <button className="music-no" onClick={skipMusic}>
              فعلاً بدون موسیقی
            </button>
          </div>
        </div>
      )}

      {/* کنترل موسیقی */}
      {showInvitation && (
        <button
          className={`music-control ${musicPlaying ? "playing" : ""}`}
          onClick={toggleMusic}
          aria-label={musicPlaying ? "قطع موسیقی" : "پخش موسیقی"}
        >
          {musicPlaying ? "♫" : "♪"}
        </button>
      )}

      {/* محتوای اصلی کارت عروسی */}
      {showInvitation && (
        <main className="invitation">
          <section className="hero">
            <p className="eyebrow">
              A SPECIAL DAY · A BEAUTIFUL BEGINNING
            </p>

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

          <div className="imageBox">
            <img
              className="blob"
              src="/gid01.gif"
              alt="Wedding couple"
            />
          </div>

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

          <div className="pomeBox"></div>

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
      )}
    </>
  );
}

export default App;
