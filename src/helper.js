import {
  weekMap, CHINESE_MODEL, PREV_DAY, CURRENT_DAY, NEXT_DAY,
} from './const'
import {
  getWeekOfMonth,
  getCurrentYear,
  getCurrentMonth,
  getDaysCountOfMonth,
  formatMonthOrDay,
  isCurrentDay,
  formatDate,
  getCurrentDate,
} from './utils'

export const getWeekSort = (model = CHINESE_MODEL) => {
  const values = [...weekMap.values()]

  if (model === CHINESE_MODEL) {
    values.splice(0, 1)
    values.push(weekMap.get(0))
  }

  return values
}

const getPrevLeftDays = (firstDay, model) => {
  let leftCount = firstDay
  // 如果是星期日
  // 正常中方日历以周日结尾
  // 西方以星期日作为第一天
  if (+leftCount === 0) {
    leftCount = model !== CHINESE_MODEL ? 0 : 6
  } else {
    leftCount = model !== CHINESE_MODEL ? leftCount : leftCount - 1
  }

  return leftCount
}

const getFullDays = (year, month, day, tag = CURRENT_DAY) => {
  const current = isCurrentDay(year, month, day)
  return {
    tag: tag,
    day: day,
    full: `${year}-${formatMonthOrDay(month)}-${formatMonthOrDay(day)}`,
    current: current,
    selected: current,
  }
}

export const getPrevYearAndMonth = (year, month) => {
  let prevYear = year
  let prevMonth = month
  if (+month === 1) {
    prevYear -= 1
    prevMonth = 12
  } else {
    prevMonth -= 1
  }
  return { year: prevYear, month: prevMonth }
}

export const getNextYearAndMonth = (year, month) => {
  let nextYear = +year
  let nextMonth = +month
  if (+month === 12) {
    nextYear += 1
    nextMonth = 1
  } else {
    nextMonth += 1
  }
  return { year: nextYear, month: nextMonth }
}

const getPrevMonthLeftDays = (year, month, firstDay, model) => {
  const yearAndMonth = getPrevYearAndMonth(year, month)
  const prevYear = yearAndMonth.year
  const prevMonth = yearAndMonth.month
  const leftCount = getPrevLeftDays(firstDay, model)

  const prevDays = []
  const prevMonthDays = getDaysCountOfMonth(prevMonth, prevYear)

  for (let i = 0; i < leftCount; i++) {
    prevDays.unshift(getFullDays(prevYear, prevMonth, prevMonthDays - i, PREV_DAY))
  }

  return prevDays
}

const getNextMonthLeftDays = (year, month, days, firstDay, model) => {
  const yearAndMonth = getNextYearAndMonth(year, month)
  const nextYear = yearAndMonth.year
  const nextMonth = yearAndMonth.month
  const leftCount = getPrevLeftDays(firstDay, model)

  const nextDays = []
  const nextLefts = 6 * 7 - (leftCount + days)
  for (let i = 0; i < nextLefts; i++) {
    nextDays.push(getFullDays(nextYear, nextMonth, i + 1, NEXT_DAY))
  }

  return nextDays
}

export const getDaysOfMonth = (year = getCurrentYear(),
  month = getCurrentMonth(), model = CHINESE_MODEL) => {
  const firstDayOfMonth = getWeekOfMonth(month, year)
  const days = getDaysCountOfMonth(month, year)
  const currentDaysArr = []
  const prevDaysArr = getPrevMonthLeftDays(year, month, firstDayOfMonth, model)
  const nextDaysArr = getNextMonthLeftDays(year, month, days, firstDayOfMonth, model)

  for (let i = 1; i <= days; i++) {
    currentDaysArr.push(getFullDays(year, month, i))
  }
  return prevDaysArr.concat(currentDaysArr).concat(nextDaysArr)
}

export const selectDayByIndex = (days, index) => days.map((day, idx) => {
  const tempDay = day
  tempDay.selected = index === idx
  return tempDay
})

export const setSelectedDays = (days, selectedDay) => {
  const fDate = formatDate(selectedDay)
  return days.map(day => {
    const tempDay = day
    tempDay.selected = day.full === fDate.format
    return tempDay
  })
}

export const getDaysAfterchangedYearOrMonth = (year = getCurrentYear(),
  month = getCurrentMonth(), model = CHINESE_MODEL) => (
  getDaysOfMonth(year, month, model)
)

export const isInCurrentMonth = (date, current = getCurrentDate()) => (
  date.substring(0, 7) === current.substring(0, 7)
)
