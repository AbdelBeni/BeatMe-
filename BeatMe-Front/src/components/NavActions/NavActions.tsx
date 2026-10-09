"use client";

import { useEffect, useState } from "react";
import { CircleUserRound, Languages } from "lucide-react";
import AccountModal from "../AccountModal/AccountModal";
import { User } from "@/types/user";
import "./NavActions.css";

export default function NavActions() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/auth/discord";
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAccountOpen(false);
    setAccountModalOpen(false);
    window.location.reload();
  };

  // ← دالة جديدة: تُستدعى من AccountModal بعد تحديث الحساب
  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <div className="nav-actions">
      {/* Support Us - كما هو */}
      <button className="nav-actions__btn nav-actions__btn--gold">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M14.781 1.76a.3.3 0 0 0-.562 0l-.346.935a.3.3 0 0 1-.178.178l-.935.346a.3.3 0 0 0 0 .562l.935.346a.3.3 0 0 1 .178.178l.346.935a.3.3 0 0 0 .562 0l.346-.935a.3.3 0 0 1 .178-.178l.935-.346a.3.3 0 0 0 0-.562l-.935-.346a.3.3 0 0 1-.178-.178zM4.22 3.26a.3.3 0 0 1 .562 0l.481 1.3a.3.3 0 0 0 .178.178l1.3.48a.3.3 0 0 1 0 .563l-1.3.481a.3.3 0 0 0-.178.178l-.48 1.3a.3.3 0 0 1-.563 0l-.481-1.3a.3.3 0 0 0-.178-.178l-1.3-.48a.3.3 0 0 1 0-.563l1.3-.481a.3.3 0 0 0 .178-.178zm-.778 7.786a.474.474 0 0 0-.424.68l3.809 7.91c.537 1.477 4.164 1.512 8.101.079s6.693-3.791 6.156-5.268L18.915 5.94a.474.474 0 0 0-.762-.248l-1.96 1.624a.4.4 0 0 0-.137.372l.118.694a1.688 1.688 0 0 1-2.664 1.644l-.814-.598.387-1.818a.474.474 0 0 0-.263-.529l-2.571-1.198a.474.474 0 0 0-.63.229L8.42 8.68a.474.474 0 0 0 .138.575l1.465 1.144-.239.982a1.688 1.688 0 0 1-3.098.452l-.355-.607a.4.4 0 0 0-.344-.197z" />
        </svg>
        <span>Support Us</span>
      </button>

      <button className="nav-actions__btn nav-actions__btn--icon" aria-label="Language">
        <Languages size={20} />
      </button>

      {loading ? (
        <button className="nav-actions__btn nav-actions__btn--dark" disabled>
          <CircleUserRound size={20} />
          <span>...</span>
        </button>
      ) : user ? (
        <div className="account-wrapper">
          <button
            onClick={() => setAccountOpen(!accountOpen)}
            className="nav-actions__btn nav-actions__btn--dark"
          >
            {user.discordAvatar ? (
              <img
                src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png?size=64`}
                alt=""
                className="nav-avatar"
              />
            ) : (
              <CircleUserRound size={20} />
            )}
            <span>{user.discordUsername}</span>
          </button>

          {accountOpen && (
            <div className="account-dropdown">
              <div className="account-header">
                <span className="account-name">{user.discordUsername}</span>
                <span className="account-rating">{user.rating} PR</span>
              </div>
              <hr />
              <div className="dropDown-content">
                <button
                  onClick={() => {
                    setAccountOpen(false);
                    setAccountModalOpen(true);
                  }}
                  className="account-entre clsh7"
                >
                  Account
                </button>
                <button className="nav-actions__btn nav-actions__btn--gold DropDown-gold">
                  <span>Support Us</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M14.781 1.76a.3.3 0 0 0-.562 0l-.346.935a.3.3 0 0 1-.178.178l-.935.346a.3.3 0 0 0 0 .562l.935.346a.3.3 0 0 1 .178.178l.346.935a.3.3 0 0 0 .562 0l.346-.935a.3.3 0 0 1 .178-.178l.935-.346a.3.3 0 0 0 0-.562l-.935-.346a.3.3 0 0 1-.178-.178zM4.22 3.26a.3.3 0 0 1 .562 0l.481 1.3a.3.3 0 0 0 .178.178l1.3.48a.3.3 0 0 1 0 .563l-1.3.481a.3.3 0 0 0-.178.178l-.48 1.3a.3.3 0 0 1-.563 0l-.481-1.3a.3.3 0 0 0-.178-.178l-1.3-.48a.3.3 0 0 1 0-.563l1.3-.481a.3.3 0 0 0 .178-.178zm-.778 7.786a.474.474 0 0 0-.424.68l3.809 7.91c.537 1.477 4.164 1.512 8.101.079s6.693-3.791 6.156-5.268L18.915 5.94a.474.474 0 0 0-.762-.248l-1.96 1.624a.4.4 0 0 0-.137.372l.118.694a1.688 1.688 0 0 1-2.664 1.644l-.814-.598.387-1.818a.474.474 0 0 0-.263-.529l-2.571-1.198a.474.474 0 0 0-.63.229L8.42 8.68a.474.474 0 0 0 .138.575l1.465 1.144-.239.982a1.688 1.688 0 0 1-3.098.452l-.355-.607a.4.4 0 0 0-.344-.197z" />
                  </svg>
                </button>
                <hr />
                <a className="account-support clsh7" href="https://discord.gg/MQs8qr6ewT" target="_blank" rel="noreferrer">
                  Support
                </a>
                <a className="account-support clsh7">Terms of service</a>
                <a className="account-support clsh7">Privacy policy</a>
              </div>
              <hr />
              <button onClick={handleLogout} className="account-logout">
                <span>Log Out</span>
                <svg
                  className="icon_caf372"
                  aria-hidden="true"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="#f53b3b"
                  viewBox="0 0 24 24"
                >
                  <path fill="var(--icon-feedback-critical)" d="M9 12a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1Z" />
                  <path
                    fill="var(--icon-feedback-critical)"
                    fillRule="evenodd"
                    d="M2.75 3.02A3 3 0 0 1 5 2h10a3 3 0 0 1 3 3v7.64c0 .44-.55.7-.95.55a3 3 0 0 0-3.17 4.93l.02.03a.5.5 0 0 1-.35.85h-.05a.5.5 0 0 0-.5.5 2.5 2.5 0 0 1-3.68 2.2l-5.8-3.09A3 3 0 0 1 2 16V5a3 3 0 0 1 .76-1.98Zm1.3 1.95A.04.04 0 0 0 4 5v11c0 .36.2.68.49.86l5.77 3.08a.5.5 0 0 0 .74-.44V8.02a.5.5 0 0 0-.32-.46l-6.63-2.6Z"
                    clipRule="evenodd"
                  />
                  <path
                    fill="var(--icon-feedback-critical)"
                    d="M15.3 16.7a1 1 0 0 1 1.4-1.4l4.3 4.29V16a1 1 0 1 1 2 0v6a1 1 0 0 1-1 1h-6a1 1 0 1 1 0-2h3.59l-4.3-4.3Z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="nav-actions__btn nav-actions__btn--dark"
        >
          <CircleUserRound size={20} />
          <span>Log In</span>
        </button>
      )}

      {/* Join Discord - كما هو */}
      <a
        href="https://discord.gg/YOUR_INVITE"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-actions__btn nav-actions__btn--brand"
      >
        <svg width={20} height={20} viewBox="0 -28.5 256 256" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
            fill="#ffffff"
            fillRule="nonzero"
          />
        </svg>
        <span>Join Our Discord</span>
      </a>

      {user && (
        <AccountModal
          user={user}
          open={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
          onLogout={handleLogout}
          onUserUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
}