#! /usr/bin/env node
import minimist from "minimist";
import { DateTime, Interval } from "luxon";

const argv = minimist(process.argv.slice(2));
const now = DateTime.now();
const year = argv["y"] || now.year;
const month = argv["m"] || now.month;
const dt = now || DateTime.local(year, month);

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
  const blanks = Array(first_date.weekday % 7).fill("   ");

  let body = [];

  body = body.concat(blanks);
  intervals.forEach((date) => {
    body.push(date.day.toString().padStart(2) + " ");
    if (date.weekday === 6) {
      body.push("\n");
    }
  });

  return body.join("");
};

const header = renderHeader(year, month);
const body = renderBody(first_date, last_date);
console.log([header, body].join("\n"));
