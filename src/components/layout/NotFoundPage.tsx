import { Link } from "@tanstack/react-router";
import { docsConfig } from "@/config/docs.config";
import { t } from "@/config/i18n";
import { Logo } from "@/components/layout/Logo";

export function NotFoundPage() {
  const href = `/${docsConfig.defaultLocale}/docs/${docsConfig.defaultVersion}`;
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo />
      <h1 className="font-display text-3xl">{t("en", "notFoundTitle")}</h1>
      <p className="text-muted">{t("en", "notFoundBody")}</p>
      <Link
        to={href as never}
        className="mt-2 inline-flex h-10 items-center rounded-[var(--radius-sm)] bg-accent px-4 text-sm font-medium text-accent-fg"
      >
        {t("en", "backHome")}
      </Link>
    </main>
  );
}
