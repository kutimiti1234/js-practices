#! /usr/bin/env node

import minimist from "minimist";
import * as luxon from "luxon";

const checkYear = (year) => {
  if (year === undefined || year === null) {
    return;
  }

  if (typeof year !== "number") {
    throw new TypeError(`cal: not a valid year ${year}`);
  } else if (year < 1 || year > 9999) {
    throw new RangeError(`cal: year \`${year}\`not in range 1..9999`);
  }
};

const checkMonth = (month) => {
  if (month === undefined || month === null) {
    return;
  }

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

const renderHeader = (year, month) => {
  const header = `      ${month}月 ${year}\n日 月 火 水 木 金 土`;
  return header;
};

const renderBody = (firstDate, lastDate) => {
  let body = "   ".repeat(firstDate.weekday % 7);

  const dates = [];
  for (let date = firstDate; date <= lastDate; date = date.plus({ days: 1 })) {
    dates.push(date);
  }

  body += dates
    .map((date) =>
      date.day
        .toString()
        .padStart(2)
        .concat(date.weekday === 6 ? "\n" : " "),
    )
    .join("")
    .trimEnd();

  return body;
};

const argv = minimist(process.argv.slice(2), {
  alias: {
    y: "year",
    m: "month",
  },
});
try {
  checkYear(argv.year);
  checkMonth(argv.month);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const now = luxon.DateTime.now();
const year = argv.year ?? now.year;
const month = argv.month ?? now.month;

const header = renderHeader(year, month);
const firstDate = luxon.DateTime.local(year, month, 1);
const lastDate = firstDate.plus({ months: 1 }).minus({ days: 1 });
const body = renderBody(firstDate, lastDate);
console.log(header);
console.log(body);
