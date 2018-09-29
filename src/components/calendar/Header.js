import React from 'react'
import Styles from './header.css'
import { DateContext } from '../../context'

const Header = () => (
  <DateContext.Consumer>
    {
      ({
        year,
        month,
        onPrevMonth,
        onPrevYear,
        onNextMonth,
        onNextYear,
      }) => {
        console.log('Header year', year)
        console.log('Header month', month)
        return (
          <div className={Styles.wrapper}>
            <i className={Styles.prevYear} role="presentation" title="上一年" onClick={e => onPrevYear(e)} />
            <i className={Styles.prevMonth} role="presentation" title="上一月" onClick={e => onPrevMonth(e)} />
            <div className={Styles.text}>
              <span className={Styles.link}>{`${year}年`}</span>
              <span className={Styles.link}>{`${month}月`}</span>
            </div>
            <i className={Styles.nextMonth} role="presentation" title="下一月" onClick={e => onNextMonth(e)} />
            <i className={Styles.nextYear} role="presentation" title="下一年" onClick={e => onNextYear(e)} />
          </div>
        )
      }
    }

  </DateContext.Consumer>
)

export default Header
