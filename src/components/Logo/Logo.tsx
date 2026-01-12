import { SiteSetting } from '@/payload-types'
import clsx from 'clsx'
import getSiteLogoUrl from '@/utilities/getSiteLogoUrl'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  siteSettingsData?: SiteSetting
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    siteSettingsData,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  const url = getSiteLogoUrl(siteSettingsData!)

  return (
    /* eslint-disable @next/next/no-img-element */
    <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
      <img
        alt={`${siteSettingsData?.siteTitle} Logo`}
        width={193}
        height={34}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        style={{ maxWidth: '9.735rem', height: 34 }}
        className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
        src={url as string}
      />
      <h3 className="pl-3 text-xl font-bold whitespace-nowrap dark:text-white">
        {siteSettingsData?.siteTitle}
      </h3>
    </div>
  )
}
