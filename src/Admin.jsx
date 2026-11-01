
import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";
import "./Admin.css";

const toFa = (value) =>
  new Intl.NumberFormat("fa-IR").format(value);

const formatDate = (value) =>
  new Date(value).toLocaleString("fa-IR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Tehran",
  });

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error) setError(error.message);
      setSession(data.session);
      setChecking(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadGuests = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("wedding_guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("خطا در دریافت اطلاعات: " + error.message);
    } else {
      setGuests(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (session) loadGuests();
    else setGuests([]);
  }, [session]);

  const attending = guests.filter((g) => g.attendance === "yes");
  const absent = guests.filter((g) => g.attendance === "no");

  const totalPeople = attending.reduce(
    (sum, guest) => sum + Number(guest.guest_count || 0),
    0
  );

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const name = `${guest.first_name} ${guest.last_name}`;

      const matchesSearch = name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesFilter =
        filter === "all" || guest.attendance === filter;

      return matchesSearch && matchesFilter;
    });
  }, [guests, search, filter]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("ایمیل یا رمز عبور اشتباه است.");
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError("خروج ناموفق بود: " + error.message);
    } else {
      setSession(null);
      setGuests([]);
    }
  };

  const exportCSV = () => {
    const rows = [
      ["نام", "نام خانوادگی", "وضعیت حضور", "تعداد نفرات", "زمان ثبت"],
      ...filteredGuests.map((g) => [
        g.first_name,
        g.last_name,
        g.attendance === "yes" ? "حاضر" : "غایب",
        g.guest_count,
        formatDate(g.created_at),
      ]),
    ];

    const csv = "\uFEFF" + rows
      .map((row) =>
        row.map((cell) =>
          `"${String(cell ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "wedding-guests.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (checking) {
    return (
      <main className="admin-page">
        <div className="admin-loading">در حال بررسی حساب...</div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-page" dir="rtl">
        <section className="admin-login-card">
          <div className="admin-brand">SASAN & ANAHITA</div>
          <div className="admin-heart">♡</div>
          <h1>پنل مدیریت جشن</h1>
          <p>برای مشاهده آمار مهمان‌ها وارد شو</p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <label htmlFor="admin-email">ایمیل مدیر</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل حساب مدیر"
              autoComplete="username"
              required
            />

            <label htmlFor="admin-password">رمز عبور</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
              autoComplete="current-password"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "در حال ورود..." : "ورود به پنل"}
            </button>

            {error && <p className="admin-error">{error}</p>}
          </form>

          <div className="admin-footer">با عشق، ساسان و آناهیتا</div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page" dir="rtl">
      <div className="admin-dashboard">
        <header className="admin-header">
          <div>
            <div className="admin-brand">SASAN & ANAHITA</div>
            <h1>مدیریت مهمان‌های جشن</h1>
            <p>خوش اومدی ❤️</p>
          </div>

          <button className="admin-logout" onClick={handleLogout}>
            خروج از حساب
          </button>
        </header>

        <section className="admin-stats">
          <article className="admin-stat">
            <span>کل پاسخ‌ها</span>
            <strong>{toFa(guests.length)}</strong>
          </article>

          <article className="admin-stat">
            <span>پاسخ‌های مثبت</span>
            <strong>{toFa(attending.length)}</strong>
          </article>

          <article className="admin-stat">
            <span>عدم حضور</span>
            <strong>{toFa(absent.length)}</strong>
          </article>

          <article className="admin-stat">
            <span>مجموع نفرات حاضر</span>
            <strong>{toFa(totalPeople)}</strong>
          </article>
        </section>

        <section className="admin-list">
          <div className="admin-list-heading">
            <div>
              <h2>فهرست مهمان‌ها</h2>
              <p>اطلاعات ثبت‌شده در دعوت‌نامه</p>
            </div>

            <div className="admin-actions">
              <button
                className="admin-refresh"
                onClick={loadGuests}
                disabled={loading}
              >
                {loading ? "در حال دریافت..." : "به‌روزرسانی"}
              </button>

              <button className="admin-export" onClick={exportCSV}>
                خروجی Excel
              </button>
            </div>
          </div>

          <div className="admin-filters">
            <input
              type="search"
              placeholder="جست‌وجوی نام یا نام خانوادگی..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">همه مهمان‌ها</option>
              <option value="yes">فقط افراد حاضر</option>
              <option value="no">فقط افراد غایب</option>
            </select>
          </div>

          {error && <p className="admin-error">{error}</p>}

          {loading && guests.length === 0 ? (
            <p className="admin-empty">در حال دریافت اطلاعات...</p>
          ) : filteredGuests.length === 0 ? (
            <p className="admin-empty">مهمانی برای نمایش پیدا نشد.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>نام و نام خانوادگی</th>
                    <th>وضعیت</th>
                    <th>تعداد نفرات</th>
                    <th>زمان ثبت</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id}>
                      <td>
                        {guest.first_name} {guest.last_name}
                      </td>

                      <td>
                        <span
                          className={
                            guest.attendance === "yes"
                              ? "admin-status yes"
                              : "admin-status no"
                          }
                        >
                          {guest.attendance === "yes" ? "حاضر" : "غایب"}
                        </span>
                      </td>

                      <td>{toFa(guest.guest_count)}</td>
                      <td>{formatDate(guest.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="admin-footer">
          با عشق، ساسان و آناهیتا ❤️
        </footer>
      </div>
    </main>
  );
}
