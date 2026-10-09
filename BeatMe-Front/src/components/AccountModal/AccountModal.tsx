"use client";

import { useState } from "react";
import Link from "next/link";
import { X, MoreVertical, Eye, LogOut } from "lucide-react";
import { User } from "@/types/user";
import ValorantLinkModal from "./ValorantLinkModal";
import "./AccountModal.css";

interface AccountModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

export default function AccountModal({
  user,
  open,
  onClose,
  onLogout,
  onUserUpdate,
}: AccountModalProps) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  if (!open) return null;

  const hasValorant = Boolean(user.riotGameName && user.riotTagLine);
  const riotName = hasValorant
    ? `${user.riotGameName}#${user.riotTagLine}`
    : "Not connected";

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className="account-modal-overlay">
        <div className="account-modal">
          {/* Left Side */}
          <div className="left-side">
            <div className="left-side-card">
              <div className="left-side-pfp">
                {user.discordAvatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png?size=128`}
                    alt={user.discordUsername}
                    className="account-profile-avatar"
                  />
                ) : (
                  <div className="account-profile-avatar account-profile-avatar--default">
                    <span>{user.discordUsername.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="left-side-content">
                <span className="left-side-username">{user.discordUsername}</span>
                <span className="left-side-vId">
                  {hasValorant ? riotName : "Riot Name"}
                </span>
              </div>
            </div>

            <div>
              <button onClick={onLogout} className="account-logout">
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
          </div>

          {/* Right Side */}
          <div className="right-side">
            <div className="account-modal__header">
              <h2>Account - Settings</h2>

              <button
                className="account-modal__close"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="account-modal__content">
              <div className="account-profile-card">
                <div className="account-profile-banner" />

                <div className="account-profile-header">
                  <div className="account-profile-avatar-wrapper">
                    {user.discordAvatar ? (
                      <img
                        src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png?size=128`}
                        alt={user.discordUsername}
                        className="account-profile-avatar"
                      />
                    ) : (
                      <div className="account-profile-avatar account-profile-avatar--default">
                        <span>{user.discordUsername.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  <h3>{user.discordUsername}</h3>

                  <button className="account-profile-more" aria-label="More">
                    <MoreVertical size={23} />
                  </button>
                </div>

                <div className="account-information">
                  <div className="account-information__item">
                    <span className="account-information__label">USERNAME</span>
                    <strong>{user.discordUsername}</strong>
                  </div>

                  <div className="account-information__item">
                    <span className="account-information__label">RIOT ID</span>
                    <strong>{riotName}</strong>
                  </div>

                  <div className="account-information__item account-information__item--joined">
                    <span className="account-information__label">JOINED</span>
                    <strong>{joinedDate}</strong>
                  </div>
                </div>

                <div className="account-actions">
                  <button
                    className="account-action account-action--logout"
                    onClick={onLogout}
                  >
                    <LogOut size={17} />
                    <span>Sign Out</span>
                  </button>

                  <Link
                    href={`/player/${user.id}`}
                    onClick={onClose}
                    className="account-action account-action--secondary"
                  >
                    <Eye size={20} />
                    <span>Show Details</span>
                  </Link>

                  {/* زر Link - يظهر فقط إن لم يُربط الحساب */}
                  {!hasValorant && (
                    <button
                      onClick={() => setLinkModalOpen(true)}
                      className="account-action account-action--secondary a-c-s"
                    >
                      <svg
                        fill="#000000"
                        width={23}
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path d="M19.8,26.1h-0.2c-2.4,0-4.8,0-7.2,0c-0.3,0-0.5-0.1-0.6-0.3c-2.5-3.2-5.1-6.3-7.6-9.5C4.1,16.1,4,16,4,15.8c0-3.1,0-6.1,0-9.2c0-0.1,0-0.2,0.1-0.2h0.1c5.2,6.5,10.4,13,15.5,19.5c0,0,0,0.1,0.1,0.1L19.8,26.1L19.8,26.1z" />
                          <path d="M27.8,16.3c-0.7,0.9-1.5,1.8-2.2,2.8c-0.2,0.2-0.4,0.3-0.6,0.3c-2.4,0-4.8,0-7.1,0c0,0-0.1,0-0.1,0c-0.1-0.1-0.2-0.1-0.1-0.2c0,0,0-0.1,0.1-0.1c2.4-3,4.7-5.9,7.1-8.9c1-1.2,2-2.5,2.9-3.7c0-0.1,0.1-0.1,0.2-0.1c0,0,0.1,0,0.1,0c0,0.1,0,0.1,0,0.2c0,3,0,6.1,0,9.1C28,16,27.9,16.2,27.8,16.3L27.8,16.3z" />
                        </g>
                      </svg>
                      <span>Link your account</span>
                      <div className="LinkValorantImages">
                        <img src="https://i.postimg.cc/BnTYZzc9/Design-sans-titre-removebg-preview.png" />
                      </div>
                    </button>
                  )}

                  {/* زر Connected - يظهر فقط إن رُبِط الحساب */}
                  {hasValorant && (
                    <button className="account-action account-action--secondary a-c-s">
                      <svg
                        className="Valo-icon-red"
                        fill="#000000"
                        width={23}
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path d="M19.8,26.1h-0.2c-2.4,0-4.8,0-7.2,0c-0.3,0-0.5-0.1-0.6-0.3c-2.5-3.2-5.1-6.3-7.6-9.5C4.1,16.1,4,16,4,15.8c0-3.1,0-6.1,0-9.2c0-0.1,0-0.2,0.1-0.2h0.1c5.2,6.5,10.4,13,15.5,19.5c0,0,0,0.1,0.1,0.1L19.8,26.1L19.8,26.1z" />
                          <path d="M27.8,16.3c-0.7,0.9-1.5,1.8-2.2,2.8c-0.2,0.2-0.4,0.3-0.6,0.3c-2.4,0-4.8,0-7.1,0c0,0-0.1,0-0.1,0c-0.1-0.1-0.2-0.1-0.1-0.2c0,0,0-0.1,0.1-0.1c2.4-3,4.7-5.9,7.1-8.9c1-1.2,2-2.5,2.9-3.7c0-0.1,0.1-0.1,0.2-0.1c0,0,0.1,0,0.1,0c0,0.1,0,0.1,0,0.2c0,3,0,6.1,0,9.1C28,16,27.9,16.2,27.8,16.3L27.8,16.3z" />
                        </g>
                      </svg>
                      <span>Account Connected</span>
                      <svg
                        className="linked-verified-icon"
                        fill="#009dff"
                        width={23}
                        viewBox="0 0 536.541 536.541"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M496.785,152.779c-3.305-25.085-16.549-51.934-38.826-74.205c-22.264-22.265-49.107-35.508-74.186-38.813c-11.348-1.499-26.5-7.766-35.582-14.737C328.111,9.626,299.764,0,268.27,0s-59.841,9.626-79.921,25.024c-9.082,6.965-24.235,13.238-35.582,14.737c-25.08,3.305-51.922,16.549-74.187,38.813c-22.277,22.271-35.521,49.119-38.825,74.205c-1.493,11.347-7.766,26.494-14.731,35.57C9.621,208.422,0,236.776,0,268.27s9.621,59.847,25.024,79.921c6.971,9.082,13.238,24.223,14.731,35.568c3.305,25.086,16.548,51.936,38.825,74.205c22.265,22.266,49.107,35.51,74.187,38.814c11.347,1.498,26.5,7.771,35.582,14.736c20.073,15.398,48.421,25.025,79.921,25.025s59.841-9.627,79.921-25.025c9.082-6.965,24.234-13.238,35.582-14.736c25.078-3.305,51.922-16.549,74.186-38.814c22.277-22.27,35.521-49.119,38.826-74.205c1.492-11.346,7.766-26.492,14.73-35.568c15.404-20.074,25.025-48.422,25.025-79.921c0-31.494-9.621-59.848-25.025-79.921C504.545,179.273,498.277,164.126,496.785,152.779z M439.256,180.43L246.477,373.209l-30.845,30.846c-8.519,8.52-22.326,8.52-30.845,0l-30.845-30.846l-56.665-56.658c-8.519-8.52-8.519-22.326,0-30.846l30.845-30.844c-8.519-8.519-22.326-8.519-30.845,0l41.237,41.236L377.561,118.74c8.52-8.519,22.326-8.519,30.846,0l30.844,30.845C447.775,158.104,447.775,171.917,439.256,180.43z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal الربط */}
      <ValorantLinkModal
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onSuccess={(updatedUser) => {
          onUserUpdate(updatedUser);
          setLinkModalOpen(false);
        }}
      />
    </>
  );
}