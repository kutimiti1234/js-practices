#! /usr/bin/env node

import minimist from "minimist";
import * as luxon from "luxon";

const checkYear = function (year) {
  if (typeof year !== "number") {
    throw new TypeError(`cal: not a valid year ${year}`);
  } else if (year < 1 || year > 9999) {
    throw new RangeError(`cal: year \`${year}\`not in range 1..9999`);
  }
};

const checkMonth = function (month) {
  if (typeof month !== "number") {
    throw new TypeError(
      `cal: ${month} is neither a month number (1..12) nor a name.`,
    );
  } else if (month < 1 || month > 12) {
    throw new RangeError(
      `cal: ${month} is neither a month number (1..12) nor a name.`,
    );
  }
};

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

const now = luxon.DateTime.now();
const defaultOption = {
  default: {
    y: now.year,
    m: now.month,
  },
};
const argv = minimist(process.argv.slice(2), defaultOption);
const year = argv.y;
const month = argv.m;
try {
  checkYear(year);
  checkMonth(month);
} catch (error) {
  console.error(error);
  process.exit(1);
}

const header = renderHeader(month, year);
const firstDate = luxon.DateTime.local(year, month, 1);
const lastDate = firstDate.plus({ months: 1 }).minus({ days: 1 });
const body = renderBody(firstDate, lastDate);
console.log([header, body].join("\n"));
