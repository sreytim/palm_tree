"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/common/LanguageProvider";

const ROLES = ["contributor", "editor", "admin"];

const ROLE_LABEL_KEYS = {
  reader: "roleReader",
  contributor: "roleContributor",
  editor: "roleEditor",
  admin: "roleAdmin",
};

export default function AdminUsers({ initialProfiles, currentUserId }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [profiles, setProfiles] = useState(initialProfiles);
  const [drafts, setDrafts] = useState({});
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  const changeRole = async (profile) => {
    const role = drafts[profile.id] ?? profile.role;
    if (role === profile.role) {
      return;
    }

    setWorkingId(profile.id);
    setError("");
    setSaved("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profile.id, role }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Could not change the account role:", result);
        setError(result.errorKey ? t(result.errorKey) : t("roleUpdateFailed"));
        return;
      }

      setProfiles((current) =>
        current.map((item) =>
          item.id === profile.id ? { ...item, role: result.role } : item,
        ),
      );
      setDrafts((current) => {
        const next = { ...current };
        delete next[profile.id];
        return next;
      });
      setSaved(t("roleUpdated"));
      router.refresh();
    } catch (requestError) {
      console.error("Role change request failed:", requestError);
      setError(t("roleUpdateFailed"));
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-clay-deep">
          {t("adminArea")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
          {t("manageAccounts")}
        </h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">
          {t("manageAccountsHint")}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-6 rounded-xl bg-clay/10 p-4 text-sm text-clay-deep"
        >
          {error}
        </p>
      )}
      {saved && (
        <p
          role="status"
          className="mb-6 rounded-xl bg-palm/10 p-4 text-sm text-palm-deep"
        >
          {saved}
        </p>
      )}

      {profiles.length === 0 ? (
        <p className="rounded-2xl border border-beige bg-cream-deep p-6 text-ink-soft">
          {t("noAccounts")}
        </p>
      ) : (
        <ul className="space-y-3">
          {profiles.map((profile) => {
            const isSelf = profile.id === currentUserId;
            const busy = workingId === profile.id;
            const currentRole = drafts[profile.id] ?? profile.role;

            return (
              <li
                key={profile.id}
                className="flex flex-col gap-4 rounded-2xl border border-beige bg-cream p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="break-words font-medium text-ink">
                    {profile.display_name || t("accountWithoutName")}
                    {isSelf ? ` · ${t("yourAccount")}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {t("currentRole")}: {t(ROLE_LABEL_KEYS[profile.role] ?? profile.role)}
                  </p>
                </div>

                <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                  <select
                    value={currentRole}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [profile.id]: event.target.value,
                      }))
                    }
                    disabled={isSelf || busy}
                    aria-label={t("userRole")}
                    className="w-full rounded-xl border border-beige bg-cream px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-palm focus:ring-2 focus:ring-palm/20 disabled:opacity-60 sm:w-auto"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {t(ROLE_LABEL_KEYS[role])}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => changeRole(profile)}
                    disabled={isSelf || busy || currentRole === profile.role}
                    className="w-full whitespace-nowrap rounded-full bg-palm px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-palm-deep disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {busy ? t("savingRole") : t("saveRole")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-6 text-xs leading-relaxed text-ink-soft">
        {t("roleOwnerNote")}
      </p>
    </section>
  );
}
