#! /usr/bin/env node

import minimist from "minimist";
import * as luxon from "luxon";

const renderHeader = function (month, year) {
  const header = `      ${month}月 ${year}\n日 月 火 水 木 金 土`;
  return header;
};

const renderBody = function (firstDate, lastDate) {
  let body = "";
  body += "   ".repeat(firstDate.weekday % 7);

  const dates = [];
  for (let date = firstDate; date <= lastDate; date = date.plus({ days: 1 })) {
    dates.push(date);
  }

  body += dates.reduce((accumulator, date) => {
    let paddedDate = date.day.toString().padStart(2);
    if (date.weekday === 6) {
      return `${accumulator}${paddedDate}\n`;
    } else {
      return `${accumulator}${paddedDate} `;
    }
  }, "");

  return body;
};

const argv = minimist(process.argv.slice(2));
const now = luxon.DateTime.now();
const year = argv.y ? argv.y : now.year;
const month = argv.m ? argv.m : now.month;

const header = renderHeader(month, year);
const firstDate = luxon.DateTime.local(year, month, 1);
const lastDate = firstDate.plus({ months: 1 }).minus({ days: 1 });
const body = renderBody(firstDate, lastDate);
console.log([header, body].join("\n"));
