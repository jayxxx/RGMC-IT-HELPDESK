// pages/_app.js
import "../styles/globals.css";
import Head from "next/head";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/admin/session");
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  function handleLogout() {
    fetch("/api/admin/logout", { method: "POST" })
      .then(() => {
        setUser(null);
        window.location.href = "/";
      })
      .catch(console.error);
  }

  return (
    <>
      <Head>
        <title>Helpdesk</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <div className="container">
          <h1 className="logo">
            <a href="/">Helpdesk</a>
          </h1>
          <nav>
            <a href="/">Home</a>
            <a href="/new-ticket">New Ticket</a>
            <a href="/track">Track Ticket</a>
            {user ? (
              <>
                <a href="/admin">Admin</a>
                <span className="user">Hello, {user.name || user.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <a href="/admin/login">Login</a>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        {loading ? <p>Loading session...</p> : <Component {...pageProps} user={user} />}
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Helpdesk. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default MyApp;
