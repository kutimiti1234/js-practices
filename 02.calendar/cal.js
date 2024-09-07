#! /usr/bin/env node

import minimist from "minimist";
import * as luxon from "luxon"

const argv = minimist(process.argv.slice(2));
const now = luxon.DateTime.now();
const year = argv.y ? argv.y : now.year
const month = argv.m ? argv.m : now.month;
const dt = luxon.DateTime.local(year, month);

const firstDate = dt.startOf("month");
const lastDate = dt.endOf("month");

const renderBody = function (firstDate, lastDate) {
  let body = "";
  const blanks = "   ".repeat(firstDate.weekday % 7);

  const intervals = luxon.Interval.fromDateTimes(firstDate, lastDate)
    .splitBy({ day: 1 })
    .map((d) => d.start);

  intervals.forEach((date) => {
    body += date.day.toString().padStart(2) + " ";
    if (date.weekday === 6) {
      body += "\n";
    }
  });

  return blanks + body;
};

const header =
  (month + "月 " + year).padStart(13) + "\n" + "日 月 火 水 木 金 土";
const body = renderBody(firstDate, lastDate);
console.log([header, body].join("\n"));
