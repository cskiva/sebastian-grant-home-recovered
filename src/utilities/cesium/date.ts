import { CesiumType } from '@/app/types/cesium'
import type { JulianDate } from 'cesium'

export function dateToJulianDate(CesiumJs: CesiumType, date: Date): JulianDate {
  return CesiumJs.JulianDate.fromDate(date)
}
