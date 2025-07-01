"use client";

import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiGreekTemple, GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle, FaScroll, FaSignOutAlt, FaUpload } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  if (!session) return null;

  const displayName =
    session.user.user_metadata?.username ||
    session.user.user_metadata?.full_name ||
    session.user.user_metadata?.name ||
    session.user.email;

  return (
    <header className="main-header">
      <div className="left-title">
        <h1 className="title-text">
          <GiGreekTemple style={{ marginRight: "8px", verticalAlign: "middle" }} />
          Ancient Artifacts Age Predictor
        </h1>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <GiHamburgerMenu size={22} />
      </div>

      <div className="right-controls">
        <span className="user-name">
          <FaUserCircle style={{ marginRight: "6px", verticalAlign: "middle" }} />
          {displayName}
        </span>

        {pathname === "/logs" ? (
          <Link className="view-upload-link" href="/upload">
            <button className="log-button">
              <FaUpload style={{ marginRight: "6px", verticalAlign: "middle" }} />
              Back to Upload
            </button>
          </Link>
        ) : (
          <Link className="view-log-link" href="/logs">
            <button className="log-button">
              <FaScroll style={{ marginRight: "6px", verticalAlign: "middle" }} />
              View Logs
            </button>
          </Link>
        )}

        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: "6px", verticalAlign: "middle" }} />
          Logout
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-dropdown">
          <span className="user-name">
            <FaUserCircle style={{ marginRight: "6px", verticalAlign: "middle" }} />
            {displayName}
          </span>
          {pathname === "/logs" ? (
            <Link className="view-upload-link" href="/upload">
              <button className="log-button">
                <FaUpload style={{ marginRight: "6px", verticalAlign: "middle" }} />
                Back to Upload
              </button>
            </Link>
          ) : (
            <Link className="view-log-link" href="/logs">
              <button className="log-button">
                <FaScroll style={{ marginRight: "6px", verticalAlign: "middle" }} />
                View Logs
              </button>
            </Link>
          )}
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: "6px", verticalAlign: "middle" }} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
