#! /usr/bin/env node

import minimist from "minimist";
import * as luxon from "luxon"

const renderHeader = function (month,year){
  const header = `      ${month}月 ${year}\n日 月 火 水 木 金 土`
  return header
}

const renderBody = function (firstDate, lastDate) {
  let body = "";
  body += "   ".repeat(firstDate.weekday % 7);

  const intervals = luxon.Interval.fromDateTimes(firstDate, lastDate)
    .splitBy({ day: 1 })
    .map((d) => d.start);

  intervals.forEach((date) => {
    body += date.day.toString().padStart(2) + " ";
    if (date.weekday === 6) {
      body += "\n";
    }
  });

  return body;
};

const argv = minimist(process.argv.slice(2));
const now = luxon.DateTime.now();
const year = argv.y ? argv.y : now.year
const month = argv.m ? argv.m : now.month;
const datetime = luxon.DateTime.local(year, month);

const firstDate = datetime.startOf("month");
const lastDate = datetime.endOf("month");


const header = renderHeader(month,year)
const body = renderBody(firstDate, lastDate);
console.log([header, body].join("\n"));
