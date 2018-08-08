import React, { Component } from 'react';
import moment from 'moment';
import { CalendarForm } from '../CalendarForm';

import './Calendar.css';

class Calendar extends Component {
  months = {
    '0': 'January',
    '1': 'February',
    '2': 'March',
    '3': 'April',
    '4': 'May',
    '5': 'June',
    '6': 'July',
    '7': 'August',
    '8': 'September',
    '9': 'October',
    '10': 'November',
    '11': 'December',
  }

  state = {
    years: [],
    holidays: {},
  };

  handleCreate = (data) => {
    const { date, days, country } = data;
    const initial = moment(date);
    const final = moment(date).add(days, 'day');

    const years = [];

    while(initial.isSameOrBefore(final)) {
      const y = initial.year();
      let yIdx = years.findIndex(x => x.label === y);

      if(yIdx === -1) {
        years.push({
          label: y,
          months: {},
        });

        yIdx = years.length - 1;
      }

      const m = initial.month();

      if(!years[yIdx].months[m]) {
        years[yIdx].months[m] = {};
      }

      years[yIdx].months[m][initial.date()] = moment(initial.format('YYYY-MM-DD'));
      
      initial.add(1, 'day');
    }

    const holidays = [];
    
    years.forEach(year => {
      if (year.label >= moment().year()) {
        return;
      }

      holidays.push(
        fetch(
          `https://holidayapi.com/v1/holidays?key=7f7fb480-1ccc-4458-bd73-e11e5614b345&country=${country}&year=${year.label}`).then(res => res.json()
        )
      );
    });

    Promise.all(holidays).then(data => {
      const holidays = {};

      data.forEach(year => {
        const dates = Object.keys(year.holidays);

        dates.forEach(holiday => {
          if (!year.holidays[holiday].find(x => x.public)) {
            return;
          }

          holidays[holiday] = year.holidays[holiday].find(x => x.public);
        });
      })

      this.setState({
        years,
        holidays,
      });
    })
  }

  renderWeeks = (month) => {
    const { holidays } = this.state;
    const keys = Object.keys(month);

    const weeks = [];

    keys.forEach(day => {
      let wIdx = weeks.findIndex(x => x.id === month[day].week());

      if (wIdx === -1) {
        weeks.push({
          id: month[day].week(),
          week: Array(7).fill(0),
        });

        wIdx = weeks.length - 1;
      }

      weeks[wIdx].week[month[day].weekday()] = month[day];
    });

    return weeks.map(w => (
      <div className="week" key={`week_${w.id}`}>
        {
          w.week.map((day, idx) => (
            <div
              key={`week_${w.id}_day_${day.date ? day.date() : 0}_${idx}`} 
              className={`day ${(day.date ? day.date() : 0) === 0 ? 'blank' : ''} ${holidays[(day.date ? day.format('YYYY-MM-DD') : 0)] ? 'holiday' : ''}`}
              title={`${holidays[(day.date ? day.format('YYYY-MM-DD') : 0)] ? holidays[(day.date ? day.format('YYYY-MM-DD') : 0)].name : ''}`}>

              { day !== 0 ? day.date ? day.date() : 0 : '' }
            </div>
          ))
        }
      </div>
    ))
  }

  renderMonths = (year, months) => {
    const keys = Object.keys(months);

    const monthsArray = [];

    keys.forEach(month => {
      monthsArray.push(
        <div key={`${year}_${month}`} className="month">
          <div className="week">
            <div className={`day label`}>S</div>
            <div className={`day label`}>M</div>
            <div className={`day label`}>T</div>
            <div className={`day label`}>W</div>
            <div className={`day label`}>T</div>
            <div className={`day label`}>F</div>
            <div className={`day label`}>S</div>
          </div>
          <span>{this.months[month]}</span>
          {
            this.renderWeeks(months[month])
          }
        </div>
      )
    });

    return (
      <React.Fragment>
        {
          monthsArray.map(x => x)
        }
      </React.Fragment>
    )
  }

  renderYears = () => {
    const { years } = this.state;

    return (
      <React.Fragment>
        {
          years.map(year => (
            <div key={`year_${year.label}`} className="year">
              <span>{year.label} {year.label >= moment().year() ? `(Holidays supported up to ${moment().year() - 1})` : '(Hover to see holiday name)'}</span>
              <div className="year-container">
                {
                  this.renderMonths(year.label, year.months)
                }
              </div>
            </div>
          ))
        }
      </React.Fragment>
    )
  }

  render() {
    
    return (
      <div className="calendar">
        <CalendarForm onCreate={data => this.handleCreate(data)}/>

        <div className="calendar-container">
          {
            this.renderYears()
          }
        </div>
      </div>
    );
  }
}

export default Calendar;
