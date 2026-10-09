"use client";

import { useState, FormEvent } from "react";
import { X, Loader2 } from "lucide-react";
import { User } from "@/types/user";
import "./ValorantLinkModal.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function ValorantLinkModal({ open, onClose, onSuccess }: Props) {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);

    const cleanGameName = gameName.trim();
    const cleanTagLine = tagLine.trim().replace(/^#/, ""); // إزالة # إن وُجد

    if (!cleanGameName || !cleanTagLine) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/valorant/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: cleanGameName,
          tagLine: cleanTagLine,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not link account");
        return;
      }

      // نجح
      onSuccess(data.user);
      setGameName("");
      setTagLine("");
      onClose();
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setError(null);
    setGameName("");
    setTagLine("");
    onClose();
  };

  return (
    <div className="valorant-modal-overlay" onClick={handleClose}>
      <div className="valorant-modal" onClick={(e) => e.stopPropagation()}>
        <div className="valorant-modal__header">
          <h2>Link your Valorant Account</h2>
          <button
            className="valorant-modal__close"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="valorant-modal__body">
          <p className="valorant-modal__description">
            Enter your Riot ID to connect your Valorant account. This is required
            to participate in matches.
          </p>

          <div className="valorant-modal__fields">
            <div className="valorant-modal__field">
              <label>Game Name</label>
              <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="PlayerTD"
                disabled={loading}
                autoFocus
                maxLength={32}
              />
            </div>

            <div className="valorant-modal__field valorant-modal__field--tag">
              <label>Tag</label>
              <div className="tag-input-wrapper">
                <span className="tag-hash">#</span>
                <input
                  type="text"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  placeholder="NA1"
                  disabled={loading}
                  maxLength={8}
                />
              </div>
            </div>
          </div>

          {error && <div className="valorant-modal__error">{error}</div>}

          <div className="valorant-modal__actions">
            <button
              type="button"
              onClick={handleClose}
              className="valorant-modal__btn valorant-modal__btn--ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="valorant-modal__btn valorant-modal__btn--primary"
              disabled={loading || !gameName.trim() || !tagLine.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Linking...</span>
                </>
              ) : (
                "Link Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}