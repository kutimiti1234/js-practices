#! /usr/bin/env node
import minimist from "minimist";
import { DateTime, Interval } from "luxon";

const argv = minimist(process.argv.slice(2));

const year = argv["y"] || DateTime.now().year;
const month = argv["m"] || DateTime.now().month;
const dt = DateTime.local(year, month);

const first_date = dt.startOf("month");
const last_date = dt.endOf("month");


const renderBody = function (first_date, last_date) {
  let body = "";
  const blanks = "   ".repeat(first_date.weekday % 7);

  const intervals = Interval.fromDateTimes(first_date, last_date)
    .splitBy({ day: 1 })
    .map((d) => d.start);

  intervals.forEach((date) => {
    body += date.day.toString().padStart(2) + " ";
    if (date.weekday === 6) {
      body += "\n";
    }
  });


  return  blanks + body;
};

const header = (month + "月 " + year).padStart(13) + "\n" + "日 月 火 水 木 金 土";
const body = renderBody(first_date, last_date);
console.log([header, body].join("\n"));
