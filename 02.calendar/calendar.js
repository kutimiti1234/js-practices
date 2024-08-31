#! /usr/bin/env node
import minimist from "minimist";
import { DateTime, Interval } from "luxon";

const argv = minimist(process.argv.slice(2));
const year = argv["y"] || dt.year;
const month = argv["m"] || dt.month;
const dt = DateTime.local(year, month);

const first_date = dt.startOf("month");
const last_date = dt.endOf("month");

const renderHeader = function (year, month) {
  const header =
    (month + "月 " + year).padStart(13) + "\n" + "日 月 火 水 木 金 土";
  return header;
};

const renderBody = function (first_date, last_date) {
  const intervals = Interval.fromDateTimes(first_date, last_date)
    .splitBy({ day: 1 })
    .map((d) => d.start);

  let body = [];

  for (let i = 1; i <= first_date.weekday % 7; i++) {
    body[i - 1] = " ".padStart(2) + " ";
  }

  for (const date of intervals) {
    body.push(date.day.toString().padStart(2) + " ");
    if (date.weekday === 6) {
      body.push("\n");
    }
  }
  return body.join("");
};

const header = renderHeader(year, month);
const body = renderBody(first_date, last_date);
console.log([header, body].join("\n"));
