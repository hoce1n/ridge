import type { LocaleCode } from "./docs.config";

export type MessageKey =
  | "docs"
  | "searchPlaceholder"
  | "searchEmpty"
  | "searchPages"
  | "searchCommands"
  | "onThisPage"
  | "editOnGitHub"
  | "previous"
  | "next"
  | "openIn"
  | "copyMarkdown"
  | "copyLink"
  | "copied"
  | "openChatGPT"
  | "openGitHub"
  | "appearance"
  | "themeSystem"
  | "themeLight"
  | "themeDark"
  | "toggleTheme"
  | "menu"
  | "close"
  | "version"
  | "language"
  | "notFoundTitle"
  | "notFoundBody"
  | "backHome"
  | "getStarted"
  | "viewSource"
  | "installLabel"
  | "footerNote"
  | "skipToContent"
  | "pageActions"
  | "navigateTo";

export const messages: Record<LocaleCode, Record<MessageKey, string>> = {
  en: {
    docs: "Docs",
    searchPlaceholder: "Search docs…",
    searchEmpty: "No results.",
    searchPages: "Pages",
    searchCommands: "Commands",
    onThisPage: "On this page",
    editOnGitHub: "Edit on GitHub",
    previous: "Previous",
    next: "Next",
    openIn: "Open in",
    copyMarkdown: "Copy page as Markdown",
    copyLink: "Copy link",
    copied: "Copied",
    openChatGPT: "Open in ChatGPT",
    openGitHub: "Open on GitHub",
    appearance: "Appearance",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
    toggleTheme: "Toggle theme",
    menu: "Menu",
    close: "Close",
    version: "Version",
    language: "Language",
    notFoundTitle: "Page not found",
    notFoundBody: "This page is not in the current version or locale.",
    backHome: "Back to docs",
    getStarted: "Get started",
    viewSource: "GitHub",
    installLabel: "Install",
    footerNote: "Ridge documentation",
    skipToContent: "Skip to content",
    pageActions: "Page actions",
    navigateTo: "Go to",
  },
  fa: {
    docs: "اسناد",
    searchPlaceholder: "جستجو در اسناد…",
    searchEmpty: "نتیجه‌ای پیدا نشد.",
    searchPages: "صفحات",
    searchCommands: "دستورات",
    onThisPage: "در این صفحه",
    editOnGitHub: "ویرایش در گیت‌هاب",
    previous: "قبلی",
    next: "بعدی",
    openIn: "باز کردن در",
    copyMarkdown: "کپی صفحه به‌صورت مارک‌داون",
    copyLink: "کپی پیوند",
    copied: "کپی شد",
    openChatGPT: "باز کردن در ChatGPT",
    openGitHub: "باز کردن در گیت‌هاب",
    appearance: "ظاهر",
    themeSystem: "سیستم",
    themeLight: "روشن",
    themeDark: "تیره",
    toggleTheme: "تغییر پوسته",
    menu: "منو",
    close: "بستن",
    version: "نسخه",
    language: "زبان",
    notFoundTitle: "صفحه پیدا نشد",
    notFoundBody: "این صفحه در نسخه یا زبان فعلی وجود ندارد.",
    backHome: "بازگشت به اسناد",
    getStarted: "شروع کنید",
    viewSource: "گیت‌هاب",
    installLabel: "نصب",
    footerNote: "اسناد Ridge",
    skipToContent: "پرش به محتوا",
    pageActions: "اقدامات صفحه",
    navigateTo: "رفتن به",
  },
};

export function t(lang: string, key: MessageKey): string {
  const pack = lang === "fa" ? messages.fa : messages.en;
  return pack[key];
}
