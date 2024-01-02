import { createLocalizedPathnamesNavigation, Pathnames } from 'next-intl/navigation';
import {Language} from "@/src/types/Language";

export const locales = [Language.En, Language.Zh] as const;

export const defaultLocale = Language.En;

export const localePrefix = 'always'; // Default

export const pathnames = {
  '/': '/',
} satisfies Pathnames<typeof locales>;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales, pathnames: pathnames as typeof pathnames & Record<string & {}, string>, localePrefix});
