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
      lastMonday: moment().startOf('isoweek'),
      chargeFrequency: 'Weekly',
      chargeAmount: 123.45,
      currentBalance: 100,
      payments: {},
      charges: {},
      totalPayment: 0
    };
  }

  handleChangeChargeFrequency = (event) => {
    this.setState({chargeFrequency: event.target.value})
  }

  handleChangeChargeAmount = (event) => {
    this.setState({chargeAmount: event.target.value})
  }

  handleChangeCurrentBalance = (event) => {
    this.setState({currentBalance: event.target.value})
  }

  showMoreWeeks = (event) => {
    this.setState({then: this.state.then.add(1, 'M')})
  }

  handleChangeCharge = (event) => {
    var v = +event.target.value;
    var c = this.state.charges;
    c[event.target.id] = v;
    
    this.setState({charges: c});
  }

  handleChangePayment = (event) => {
    var v = +event.target.value;
    var p = this.state.payments;
    p[event.target.id] = v;
    
    const totalPayment = Object.values(p).reduce((t, n) => t + n)

    this.setState({payments: p, totalPayment: totalPayment});
  }

  drawChargeCell(day, index) {
    return <td>
      <input type="text" id={day.getTime()} onChange={this.handleChangeCharge}  tabindex={index}/>
    </td>
  }

  drawPaymentCell(day, index) {
    return <td>
      <input type="text" id={day.getTime()} onChange={this.handleChangePayment} disabled={day < moment()} tabindex={index}/>
    </td>
  }

  getPayments(day) {
    return Object.keys(this.state.payments)
      .filter(x => x <= day)
      .map(x => this.state.payments[x])
      .reduce((t, n) => t + n, 0)
  }

  getCharges(day) {
    return Object.keys(this.state.charges)
      .filter(x => x <= day)
      .map(x => this.state.charges[x])
      .reduce((t, n) => t + n, 0)
  }

  getBalance(day) {
    return +this.state.currentBalance
      +this.getCharges(day)
      -this.getPayments(day)
  }

  getLastPaymentDay() {
    return Object.keys(this.state.payments)
      .sort()
      .slice(-1)[0];
  }

  drawBalanceCell(day, index) {
    return <td>
      <input type="text" value={this.getBalance(day)} tabindex={index}/>
    </td>
  }

  render() {
    return (
      <div>
        <h1>Repayment Plan</h1>
        <div class="inputs">
          <div>
            <label>
              Charge Frequency:
              <input type="text" value={this.state.chargeFrequency} onChange={this.handleChangeChargeFrequency}/>
            </label>
          </div>
          <div>
            <label>
              Charge Amount:
              <input type="text" value={this.state.chargeAmount} onChange={this.handleChangeChargeAmount}/>
            </label>
          </div>
          <div>
            <label>
              Current Balance:
              <input type="text" value={this.state.currentBalance} onChange={this.handleChangeCurrentBalance}/>
            </label>
          </div>
        </div>

        <div class="calendar">
          <table>
            <tr>
              <th>WC</th>
              <th>£C</th>
              <th>M</th>
              <th>T</th>
              <th>W</th>
              <th>T</th>
              <th>F</th>
              <th>S</th>
              <th>S</th>
              <th>£B</th>
            </tr>
            {
              getDates(this.state.lastMonday.toDate(), this.state.then.toDate(), 7).map(
                (o, i) => 
                <tr>
                  <td>{moment(o).format('DD/MM/YYYY')}</td>
                  {this.drawChargeCell(o, i)}
                  {this.drawPaymentCell(o, i+100)}
                  {this.drawPaymentCell(o.addDays(1), i + 1000)}
                  {this.drawPaymentCell(o.addDays(2), i + 100000)}
                  {this.drawPaymentCell(o.addDays(3), i + 1000000)}
                  {this.drawPaymentCell(o.addDays(4), i + 10000000)}
                  {this.drawPaymentCell(o.addDays(5), i + 100000000)}
                  {this.drawPaymentCell(o.addDays(6), i + 1000000000)}
                  {this.drawBalanceCell(o.addDays(6))}
                </tr>
              )
            }
          </table>
          <input type="button" value="+" onClick={this.showMoreWeeks}/>
        </div>

        <div id="summary">
          {this.getBalance(this.getLastPaymentDay()) > 0 && <h3>You have a balance of £{this.getBalance(this.getLastPaymentDay())} remaining</h3>}
          {this.getBalance(this.getLastPaymentDay()) <= 0 && <h3>You have paid back the full £{this.state.currentBalance}</h3>}
          {this.getBalance(this.getLastPaymentDay()) < 0 && <h3>You also have an advance of £{Math.abs(this.getBalance(this.getLastPaymentDay()))} </h3>}
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
