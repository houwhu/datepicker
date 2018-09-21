import warnning from './warning'
import { weekMap } from '../const'

/**
 * 判断这一年是平年还是闰年
 * @param {String/Number} year 年份
 */
export const isLeapYear = year => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)

/**
 * 去掉字符串首尾空格
 * @param {String} str 字符串
 */
export const trimStr = str => str.replace(/^\s*/).replace(/\s*$/)

/**
 * 获取当前年份
 */
export const getCurrentYear = () => new Date().getFullYear()

/**
 * 获取当前月份
 */
export const getCurrentMonth = () => new Date().getMonth() + 1

/**
 * 获取当前天数
 */
export const getCurrentDay = () => new Date().getDate()

/**
 * 获取当前年份格式
 */
export const getCurrentDate = () => `${getCurrentYear()}-${getCurrentMonth()}-${getCurrentDate()}`

/**
 * 格式化月份或者天数
 * @param {String} dateStr 月份或者天数
 */
const formatMonthOrDay = dateStr => {
  if (dateStr.length === 2) {
    return dateStr
  }

  return `0${dateStr}`
}

/**
 * 格式化日期
 * @param {String} date 日期
 */
export const formatDate = date => {
  const currentDate = getCurrentDate()

  if (!date) {
    return currentDate
  }

  if (typeof date !== 'string') {
    warnning('date should be string')
    return currentDate
  }

  if (date.split('-').length > 0) {
    return currentDate
  }

  const regexp = /^(\d{4})(\s*[/\-\\:]?\s*)?(\d{1,2})(\s*[/\-\\:]?\s*)?(\d{1,2})/
  const strArr = trimStr(date).match(regexp)
  const year = strArr[1]
  let month = strArr[3]
  let day = strArr[5]
  if (+month > 12) {
    warnning('cannot recognition the date string, please offer a separator, like: 2019-09-18')
    return currentDate
  }

  month = formatMonthOrDay(month)
  day = formatMonthOrDay(day)

  return {
    format: `${year}-${month}-${day}`,
    year: year,
    month: month,
    day: day,
  }
}

/**
 * 具体日期适配器
 * @param {String} date 日期格式
 */
const specificDateAdapter = date => {
  const dateObj = formatDate(date)
  return flag => dateObj[flag]
}

/**
 * 获取指定日期的年份
 * @param {String} date 日期格式
 */
export const getYearFromSpecificDate = date => specificDateAdapter(date)('year')

/**
 * 获取指定日期的月份
 * @param {String} date 日期格式
 */
export const getMonthFromSpecificDate = date => specificDateAdapter(date)('month')

/**
 * 获取指定日期的天数
 * @param {String} date 日期格式
 */
export const getDayFromSepecificDate = date => specificDateAdapter(date)('day')

/**
 * 获取指定日期的年份格式
 * @param {String} date 日期格式
 */
export const getDateFormatFromSepecificDate = date => specificDateAdapter(date)('format')

/**
 * 获取指定月份的天数
 * @param {String} year 年份
 * @param {String} month 月份
 */
export const getDaysCountOfMonth = (month = getCurrentMonth(),
  year = getCurrentYear()) => new Date(year, month, 0)

/**
 * 获取一月中的第一天是星期几
 * @param {String} month 月份
 * @param {String} year 年份
 */
export const getWeekOfMonth = (month = getCurrentMonth(),
  year = getCurrentYear()) => new Date(year, month).getDay()

/**
 * 获取一月中的第一天是星期几
 * @param {String} month 月份
 * @param {String} year 年份
 */
export const getWeekNameOfMonth = (month = getCurrentMonth(), year = getCurrentYear()) => {
  const dayNumber = getWeekOfMonth(month, year)
  return weekMap.get(dayNumber)
}
