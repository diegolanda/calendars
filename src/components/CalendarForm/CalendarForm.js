import React, { Component } from 'react';
import moment from 'moment';

import './CalendarForm.css';

class CalendarForm extends Component {
  state = {
    date: moment().format('YYYY-MM-DD'),
    days: 5,
    country: 'US',
    errors: {},
  };

  changeState = (prop, partial) => {
    this.setState({
      [prop]: partial,
    });
  };

  hasErrors = () => {
    const errors = {};

    const { date, days, country } = this.state;

    if (!moment(date, 'YYYY-MM-DD').isValid()) {
      errors.date = true;
    }

    if (!days || isNaN(days) || days < 1) {
      errors.days = true;
    }

    if (!country || country.length < 2) {
      errors.country = true;
    }

    return errors;
  };

  handleRender = () => {
    const errors = this.hasErrors();

    this.setState({
      errors,
    });

    if (errors.length > 0) {
      return;
    }

    const { onCreate } = this.props;

    if (onCreate) {
      const { date, days, country } = this.state;
      onCreate({
        date,
        days,
        country,
      });
    }
  };

  render() {
    const { date, days, country, errors } = this.state;

    return (
      <div className="calendar-form">
        <input
          className={`${errors.date ? 'error' : ''}`}
          placeholder="Starting (YYYY-MM-DD)"
          onChange={({ target }) => this.changeState('date', target.value)}
          value={date}
        />
        <input
          className={`small ${errors.days ? 'error' : ''}`}
          placeholder="Days"
          onChange={({ target }) => this.changeState('days', target.value)}
          value={days}
        />
        <input
          className={`small ${errors.country ? 'error' : ''}`}
          placeholder="Code"
          onChange={({ target }) => this.changeState('country', target.value)}
          value={country}
          maxLength={2}
        />
        <button onClick={() => this.handleRender()}>Render</button>
      </div>
    );
  }
}

export default CalendarForm;
