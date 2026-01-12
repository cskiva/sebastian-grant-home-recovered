import type { Media, SiteSetting } from '@/payload-types'

import { getMediaUrl } from './getMediaUrl'

function getSiteLogoUrl(siteSettingsData: SiteSetting) {
  const siteSettingMediaParse = siteSettingsData?.siteLogo as Media

  if (siteSettingMediaParse) {
    const sizes = siteSettingMediaParse.sizes
    const hasNullSizes = Object.values(sizes as Record<string, any>).some(
      (x) => x.url === '' || x.url === null,
    )
    const url = hasNullSizes
      ? siteSettingMediaParse.url
      : getMediaUrl(siteSettingMediaParse?.sizes?.og?.url)

    return url
  } else return null
}

export default getSiteLogoUrl
