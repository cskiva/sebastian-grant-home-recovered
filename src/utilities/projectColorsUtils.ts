import chroma from 'chroma-js'
import regionsData from '@/app/_data/geo/simple-regions.json'

// Function to determine whether a color is light or dark
function isLightColor(hexColor: string) {
  // Convert hex to RGB
  const rgb = hexColor.charAt(0) === '#' ? hexColor.substring(1, 7) : hexColor
  const r = parseInt(rgb.substring(0, 2), 16) // Red color
  const g = parseInt(rgb.substring(2, 4), 16) // Green color
  const b = parseInt(rgb.substring(4, 6), 16) // Blue color

  // Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Return whether the color is light or dark
  return brightness > 128
}

export const getRegionColors = (region: string, theme: string) => {
  console.log(theme, 'getRegionColors Theme')

  const regionColor = regionsData.find(
    (regionData) => regionData.name.toLocaleLowerCase() === region.toLocaleLowerCase(),
  )?.color

  const baseTextColor = isLightColor(regionColor ?? '#000000')
    ? '#121212'
    : theme === 'dark'
      ? 'black'
      : '#CDCDCD'
  const textColor = chroma.mix(baseTextColor, regionColor ?? '#000000', 0.2, 'rgb').hex()

  return { regionColor, textColor }
}
