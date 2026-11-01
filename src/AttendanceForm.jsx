import { useState } from "react";
import { supabase } from "./supabaseClient";
import "./AttendanceForm.css";

export default function AttendanceForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!firstName.trim() || !lastName.trim() || !attendance) {
      setMessage("لطفاً نام، نام خانوادگی و وضعیت حضورت رو مشخص کن.");
      setMessageType("error");
      return;
    }

    const count = attendance === "yes" ? Number(guestCount) : 0;

    if (
      attendance === "yes" &&
      (!Number.isInteger(count) || count < 1 || count > 20)
    ) {
      setMessage("لطفاً تعداد نفرات رو بین ۱ تا ۲۰ وارد کن.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("wedding_guests").insert([
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          attendance,
          guest_count: count,
        },
      ]);

      if (error) throw error;

      if (attendance === "yes") {
        setMessage(
          `${firstName} عزیز، چه عالی! ❤️ حضور شما با ${count} نفر ثبت شد. بی‌صبرانه منتظر دیدارتون در جشنمون هستیم. با عشق، ساسان و آناهیتا`,
        );
      } else {
        setMessage(
          `${firstName} عزیز، ممنون که ما رو از تصمیمت مطلع کردی. جای خالیتون رو در جشنمون احساس می‌کنیم. ❤️ با عشق، ساسان و آناهیتا`,
        );
      }

      setMessageType("success");
      setFirstName("");
      setLastName("");
      setAttendance("");
      setGuestCount("1");
    } catch (error) {
      console.error("Attendance error:", error);

      setMessage(`خطا: ${error.message} | کد: ${error.code || "نامشخص"}`);

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="attendance-section" dir="rtl">
      <div className="attendance-card">
        <span className="attendance-subtitle">SASAN & ANAHITA</span>

        <h2>در جشن ما کنارمون هستی؟</h2>

        <p className="attendance-description">
          خوشحال می‌شیم حضورت رو بهمون اطلاع بدی ❤️
        </p>

        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="attendance-field">
            <label htmlFor="firstName">نام</label>
            <input
              id="firstName"
              type="text"
              placeholder="نام شما"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div className="attendance-field">
            <label htmlFor="lastName">نام خانوادگی</label>
            <input
              id="lastName"
              type="text"
              placeholder="نام خانوادگی شما"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div className="attendance-options">
            <label
              className={`attendance-option ${
                attendance === "yes" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value="yes"
                checked={attendance === "yes"}
                onChange={(e) => setAttendance(e.target.value)}
              />
              <span className="option-icon">♥</span>
              <span>با کمال میل میام</span>
            </label>

            <label
              className={`attendance-option ${
                attendance === "no" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value="no"
                checked={attendance === "no"}
                onChange={(e) => setAttendance(e.target.value)}
              />
              <span className="option-icon">♡</span>
              <span>متأسفانه نمی‌رسم</span>
            </label>
          </div>

          {attendance === "yes" && (
            <div className="attendance-field">
              <label htmlFor="guestCount">تعداد کل نفرات با احتساب خودت</label>
              <input
                id="guestCount"
                type="number"
                min="1"
                max="20"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="attendance-submit"
            disabled={loading}
          >
            {loading ? "در حال ثبت..." : "ثبت پاسخ"}
          </button>

          {message && (
            <p
              className={`attendance-message ${messageType}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </form>

        <div className="attendance-footer">با عشق، ساسان و آناهیتا</div>
      </div>
    </section>
  );
}
