import React from 'react'

export default function getLocale({ localeParams }: { localeParams: string | null }) {
  type Locale = 'en' | 'fr' | 'km' | 'vi'

  const defaultLocale: Locale = 'en'

  function getLocaleFromSearchParams(param: string | null): Locale {
    switch (param) {
      case 'en':
      case 'fr':
      case 'km':
      case 'vi':
        return param
      default:
        return 'en'
    }
  }

  const locale: Locale = getLocaleFromSearchParams(localeParams ?? defaultLocale)
  return locale
}
