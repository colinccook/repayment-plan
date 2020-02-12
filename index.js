import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';
import moment from 'moment';

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate, step) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(step);
    }
    return dateArray;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      now: moment(),
      then: moment().add(2, 'M'),
      lastMonday: moment().startOf('week').isoWeekday(1),
      rentFrequency: 'Weekly',
      rentAmount: 123.45,
      accountBalance: 100,
      payments: {},
      totalPayments: 0
    };
  }

  handleChangeRentFrequency = (event) => {
    this.setState({rentFrequency: event.target.value})
  }

  handleChangeRentAmount = (event) => {
    this.setState({rentAmount: event.target.value})
  }

  handleChangeAccountBalance = (event) => {
    this.setState({accountBalance: event.target.value})
  }

  showMoreWeeks = (event) => {
    this.setState({then: this.state.then.add(1, 'M')})
  }

  handleChangePayment = (event) => {
    var v = +event.target.value;
    var p = this.state.payments;
    p[event.target.id] = v;
    
    const tp = Object.values(p).reduce((t, n) => t + n)

    this.setState({payments: p, totalPayments: tp});
  }

  drawCell(day, index) {
    return <td>
      <input type="text" id={day.getTime()} onChange={this.handleChangePayment} disabled={day < moment()} tabindex={index}/>
    </td>
  }

  render() {
    return (
      <div>
        <h1>Repayment Plan</h1>
        <div class="inputs">
          <div>
            <label>
              Rent Frequency:
              <input type="text" value={this.state.rentFrequency} onChange={this.handleChangeRentFrequency}/>
            </label>
          </div>
          <div>
            <label>
              Rent Amount:
              <input type="text" value={this.state.rentAmount} onChange={this.handleChangeRentAmount}/>
            </label>
          </div>
          <div>
            <label>
              Account Balance:
              <input type="text" value={this.state.accountBalance} onChange={this.handleChangeAccountBalance}/>
            </label>
          </div>
        </div>

        <div class="calendar">
          <table>
            <tr>
              <th>WC</th>
              <th>M</th>
              <th>T</th>
              <th>W</th>
              <th>T</th>
              <th>F</th>
              <th>S</th>
              <th>S</th>
            </tr>
            {
              getDates(this.state.lastMonday.toDate(), this.state.then.toDate(), 7).map(
                (o, i) => 
                <tr>
                  <td>{moment(o).format('DD/MM/YYYY')}</td>
                  {this.drawCell(o, i)}
                  {this.drawCell(o.addDays(1), i + 100)}
                  {this.drawCell(o.addDays(2), i + 10000)}
                  {this.drawCell(o.addDays(3), i + 100000)}
                  {this.drawCell(o.addDays(4), i + 1000000)}
                  {this.drawCell(o.addDays(5), i + 10000000)}
                  {this.drawCell(o.addDays(6), i + 100000000)}
                </tr>
              )
            }
          </table>
          <input type="button" value="+" onClick={this.showMoreWeeks}/>
        </div>

        <div id="summary">
          {this.state.accountBalance - this.state.totalPayments > 0 && <h3>You have an account balance of £{this.state.accountBalance - this.state.totalPayments} remaining</h3>}
          {this.state.accountBalance - this.state.totalPayments <= 0 && <h3>You have paid back the full £{this.state.accountBalance}!</h3>}
          {this.state.accountBalance - this.state.totalPayments < 0 && <h3>You also have an advance of £{Math.abs(this.state.accountBalance - this.state.totalPayments)} </h3>}
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
