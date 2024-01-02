'use client';

import { useLocale } from 'next-intl';
import { startTransition, useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from '@/src/navigation';
import { useTheme } from 'next-themes';
import zhIcon from './img/zh.svg';
import enIcon from './img/en.svg';
import zhIconLight from './img/zh.light.svg';
import enIconLight from './img/en.light.svg';
import { Theme } from '@/src/types/Theme';
import { Language } from '@/src/types/Language';
import { Button } from 'antd-mobile';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const otherLocale = locale === Language.En ? Language.Zh : Language.En;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChange = () => {
    startTransition(() => {
      router.replace(pathname, { locale: otherLocale });
    });
  };

  const localeIcon = {
    en: theme === Theme.Dark ? enIconLight : enIcon,
    zh: theme === Theme.Dark ? zhIconLight : zhIcon,
  };

  return (
    <Button onClick={handleChange} fill={'none'}>
      <Image src={localeIcon[locale]} alt="switch language" className="w-5 cursor-pointer" />
    </Button>
  );
};

export default LanguageSwitcher;
