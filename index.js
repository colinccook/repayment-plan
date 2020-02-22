import React, { Component } from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./style.css";

import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

class App extends Component {
  constructor() {
    super();
    this.state = {
      chargeFrequency: "weekly",
      chargeAmount: 100,
      currentBalance: 100,
      payments: {},
      totalPayment: 0
    };
  }

  handleChangeChargeFrequency = event => {
    this.setState({ chargeFrequency: event.target.value });
  };

  handleChangeChargeAmount = event => {
    this.setState({ chargeAmount: event.target.value });
  };

  handleChangeCurrentBalance = event => {
    this.setState({ currentBalance: event.target.value });
  };

  showMoreWeeks = event => {
    this.setState({ then: this.state.then.add(1, "M") });
  };

  handleChangePayment = event => {
    var v = +event.target.value;
    var p = this.state.payments;
    p[event.target.id] = v;

    if (!event.target.value) delete p[event.target.id];

    const totalPayment = Object.values(p).reduce((t, n) => t + n, 0);

    this.setState({ payments: p, totalPayment: totalPayment });
  };

  drawChargeCell(day, index) {
    return (
      <td>
        <input
          type="text"
          value={this.getCharges(day, day.add(7, "days"))}
          tabIndex={index}
        />
      </td>
    );
  }

  drawPaymentCell(day, index) {
    return (
      <td>
        <input
          type="text"
          id={day}
          onChange={this.handleChangePayment}
          disabled={day < moment()}
          tabIndex={index}
        />
      </td>
    );
  }

  getPayments(day) {
    return Object.keys(this.state.payments)
      .filter(x => x <= day)
      .map(x => this.state.payments[x])
      .reduce((t, n) => t + n, 0);
  }

  getCharges(from, to) {
    // var range = Array.from(
    //           moment
    //             .range(
    //               from,
    //               to
    //             )
    //             .by("week")
    //         )
    // console.log(range);
    // console.log(Array.from(moment.range(from, to).by('day')));
    // return Array.from(moment.range(from, to).by('day'))
    //   .map(x => this.getCharge(x))
    //   .reduce((t, n) => t + n, 0);
    return 1;
  }

  getCharge(day) {
    if (this.state.chargeFrequency == "weekly") {
      return day.weekday() === 0 ? this.state.chargeAmount : 0;
    } else if (this.state.chargeFrequency == "monthly") {
      return day == day.startOf("month") ? this.state.chargeAmount : 0;
    }
  }

  getBalance(day) {
    return (
      +this.state.currentBalance + this.getCharges(day) - this.getPayments(day)
    );
  }

  getLastPaymentDay() {
    return Object.keys(this.state.payments)
      .sort()
      .slice(-1)[0];
  }

  drawBalanceCell(day, index) {
    return (
      <td>
        <input type="text" value={this.getBalance(day)} tabIndex={index} />
      </td>
    );
  }

  render() {
    return (
      <div>
        <h2>Repayment Plan</h2>
        <div className="inputs">
          <div>
            <label>
              Charge Weekly
              <input
                type="radio"
                value="weekly"
                name="charge"
                onClick={this.handleChangeChargeFrequency}
                defaultChecked
              />
            </label>
            <label>
              Charge Monthly
              <input
                type="radio"
                value="monthly"
                name="charge"
                onClick={this.handleChangeChargeFrequency}
              />
            </label>
          </div>
          <div>
            <label>
              Charge Amount:
              <input
                type="text"
                value={this.state.chargeAmount}
                onChange={this.handleChangeChargeAmount}
              />
            </label>
          </div>
          <div>
            <label>
              Current Balance:
              <input
                type="text"
                value={this.state.currentBalance}
                onChange={this.handleChangeCurrentBalance}
              />
            </label>
          </div>
        </div>

        <div className="calendar">
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
            {Array.from(
              moment
                .range(
                  moment().startOf("isoweek"),
                  moment()
                    .startOf("isoweek")
                    .add(2, "months")
                )
                .by("week")
            ).map((o, i) => (
              <tr>
                <td>{o.format("DD/MM/YYYY")}</td>
                {this.drawChargeCell(o, i)}
                {this.drawPaymentCell(o, i + 100)}
                {this.drawPaymentCell(o.add(1, "days"), i + 1000)}
                {this.drawPaymentCell(o.add(2, "days"), i + 100000)}
                {this.drawPaymentCell(o.add(3, "days"), i + 1000000)}
                {this.drawPaymentCell(o.add(4, "days"), i + 10000000)}
                {this.drawPaymentCell(o.add(5, "days"), i + 100000000)}
                {this.drawPaymentCell(o.add(6, "days"), i + 1000000000)}
                {this.drawBalanceCell(o.add(6, "days"))}
              </tr>
            ))}
          </table>
          <input type="button" value="+" onClick={this.showMoreWeeks} />
        </div>

        <div id="summary">
          {this.getBalance(this.getLastPaymentDay()) > 0 && (
            <h3>
              You have a balance of £{this.getBalance(this.getLastPaymentDay())}{" "}
              remaining
            </h3>
          )}
          {this.getBalance(this.getLastPaymentDay()) <= 0 && (
            <h3>You have paid back the full £{this.state.currentBalance}</h3>
          )}
          {this.getBalance(this.getLastPaymentDay()) <= 0 && (
            <h3>
              It will take {Object.keys(this.state.payments).length} payments,
              with the final being{" "}
            </h3>
          )}
          {this.getBalance(this.getLastPaymentDay()) < 0 && (
            <h3>
              This is inclusive of an advance of £
              {Math.abs(this.getBalance(this.getLastPaymentDay()))}{" "}
            </h3>
          )}
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
