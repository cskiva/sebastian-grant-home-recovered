import { Logo } from './Logo'
import { SiteSetting } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

export default async function LogoServer({ className }: { className: string }) {
  const siteSettingsData: SiteSetting = await getCachedGlobal('siteSettings', 1)()
  return <Logo siteSettingsData={siteSettingsData} className={className} />
}
