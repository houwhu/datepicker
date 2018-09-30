import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Styles from './picker.css'
import {
  getDateFormatFromSepecificDate,
  getCurrentYear,
  getCurrentMonth,
  isDateValid,
  getYearFromSpecificDate,
  getMonthFromSpecificDate,
} from '../../utils'
import Modal from '../modal/Modal'
import {
  CHINESE_MODEL, WESTERN_MODEL, _, INPUT_DEFAULT_PLACEHOLDER,
} from '../../const'
import { DateContext, initialData } from '../../context'
import {
  setSelectedDays,
  getDaysOfMonth,
  getWeekSort,
  getDaysAfterchangedYearOrMonth,
  getPrevYearAndMonth,
  getNextYearAndMonth,
  isInCurrentMonth,
  resetCalendarFromSpecialDay,
} from '../../helper'
import '../../utils/closest-polyfill'

/* eslint-disable no-underscore-dangle */
class DatePicker extends Component {
  constructor(props) {
    super(props)
    const { defaultDate, year, month } = this.props
    this.state = {
      year: year,
      month: month,
      value: defaultDate,
      showModal: false,
      ...initialData,
    }
  }

  componentDidMount() {
    const { value } = this.state
    this._onInitialDefaultDay({ full: value })
    this._addGlobalClickListener()
  }

  onModalOpen = () => {
    this.setState({ showModal: true })
  }

  onModalClose = () => {
    this.setState({ showModal: false })
  }

  onInputChange = event => {
    const val = event.target.value
    this.setState({ value: val }, () => {
      if (!val || isDateValid(val)) {
        const { days } = this.state
        const afterSetDays = setSelectedDays(days, val)
        this.setState({ days: afterSetDays })
      }
    })
  }

  onInputClear = () => {
    this.setState({ value: '', showModal: false })
  }

  onChangeModel = model => {
    const { value, year, month } = this.state
    let nextModel = model
    if (model === CHINESE_MODEL) {
      nextModel = WESTERN_MODEL
    } else {
      nextModel = CHINESE_MODEL
    }

    const weekTags = getWeekSort(nextModel)
    const changeModelDays = getDaysOfMonth(year, month, nextModel)
    const afterSetDays = setSelectedDays(changeModelDays, value)
    this.setState({
      model: nextModel,
      weekTags: weekTags,
      days: afterSetDays,
    })
  }

  _selectDayCallback = day => {
    const { onSelectDate } = this.props
    this.onModalClose()
    onSelectDate(day)
  }

  onSelectDay = day => {
    const {
      days, value, year, month,
    } = this.state
    const specialDays = resetCalendarFromSpecialDay(days, day.full, value)
    const { changeYear, changeMonth, afterDays } = specialDays
    this.setState({
      days: afterDays,
      year: changeYear === _ ? year : changeYear,
      month: changeMonth === _ ? month : changeMonth,
      value: day.full,
    }, () => this._selectDayCallback(day.full))
  }

  onSelectToday = today => {
    const {
      days, value, year, month,
    } = this.state
    let renderDays = days
    let changeYear = year
    let changeMonth = month

    if (!isInCurrentMonth(today, value)) {
      // 不是在【今天】这个月份，需要重新换数据源
      renderDays = initialData.days
      changeYear = getYearFromSpecificDate(today)
      changeMonth = getMonthFromSpecificDate(today)
    }

    const afterSetDays = setSelectedDays(renderDays, today)
    this.setState({
      value: today,
      days: afterSetDays,
      year: changeYear,
      month: changeMonth,
    }, () => this._selectDayCallback(today))
  }

  _onChangeYearOrMonth = (changeYear, changeMonth) => {
    const {
      model, year, month, value,
    } = this.state
    const days = getDaysAfterchangedYearOrMonth(changeYear, changeMonth, model)
    const afterSetDays = setSelectedDays(days, value)
    this.setState({
      days: afterSetDays,
      year: changeYear === _ ? year : changeYear,
      month: changeMonth === _ ? month : changeMonth,
    })
  }

  onPrevMonth = () => {
    const { year, month } = this.state
    const yearAndMonth = getPrevYearAndMonth(year, month)
    this._onChangeYearOrMonth(yearAndMonth.year, yearAndMonth.month)
  }

  onPrevYear = () => {
    const { year } = this.state
    this._onChangeYearOrMonth(year - 1, _)
  }

  onNextMonth = () => {
    const { year, month } = this.state
    const yearAndMonth = getNextYearAndMonth(year, month)
    this._onChangeYearOrMonth(yearAndMonth.year, yearAndMonth.month)
  }

  onNextYear = () => {
    const { year } = this.state
    this._onChangeYearOrMonth(+year + 1, _)
  }

  _addGlobalClickListener() {
    document.addEventListener('click', event => {
      if (event.target.closest('.picker-wrapper')) {
        return
      }

      const { value } = this.state
      if (!isDateValid(value)) {
        this.onSelectToday(getDateFormatFromSepecificDate())
      } else {
        this.onModalClose()
      }
    })
  }

  _onInitialDefaultDay() {
    const {
      days, value, year, month,
    } = this.state
    const specialDays = resetCalendarFromSpecialDay(days, value)
    const { changeYear, changeMonth, afterDays } = specialDays
    this.setState({
      days: afterDays,
      year: changeYear === _ ? year : changeYear,
      month: changeMonth === _ ? month : changeMonth,
    })
  }

  render() {
    const { inline, placeholder, disable } = this.props
    const { value, showModal } = this.state

    return (
      <div className={`picker-wrapper ${Styles.wrapper}`}>
        <div
          className={Styles.container}
          style={inline ? { display: 'inline-block' } : {}}
        >
          <span className={Styles.inputWrapper}>
            <input
              type="text"
              disabled={disable}
              readOnly={disable}
              placeholder={placeholder}
              className={classNames(Styles.input, { [Styles.disable]: disable })}
              value={value}
              onChange={e => this.onInputChange(e)}
              onFocus={e => this.onModalOpen(e)}
            />
          </span>
          <i className={Styles.calendar} />
          <i
            className={Styles.close}
            onClick={this.onInputClear}
            role="presentation"
          />
          <div className={Styles.line} />
        </div>
        { disable && <div className={Styles.inputDisable} /> }
        <DateContext.Provider
          value={
            {
              ...this.props,
              ...this.state,
              onSelectDay: this.onSelectDay,
              onSelectToday: this.onSelectToday,
              onChangeModel: this.onChangeModel,
              onPrevMonth: this.onPrevMonth,
              onPrevYear: this.onPrevYear,
              onNextMonth: this.onNextMonth,
              onNextYear: this.onNextYear,
              onInputChange: this.onInputChange,
            }
          }
        >
          <Modal
            isMounted={showModal}
            delayTime={200}
          />
        </DateContext.Provider>
      </div>
    )
  }
}

DatePicker.defaultProps = {
  inline: false,
  placeholder: INPUT_DEFAULT_PLACEHOLDER,
  defaultDate: getDateFormatFromSepecificDate(),
  year: getCurrentYear(),
  month: getCurrentMonth(),
  disable: false,
}

DatePicker.propTypes = {
  inline: PropTypes.bool,
  placeholder: PropTypes.string,
  defaultDate: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  month: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectDate: PropTypes.func.isRequired,
  disable: PropTypes.bool,
}

export default DatePicker
