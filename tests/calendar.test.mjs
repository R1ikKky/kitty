import { test } from "node:test";
import assert from "node:assert/strict";
import { dateKey, mondayOf, monthDates, weekOffset } from "../apps/web/app/calendar.ts";

test("month includes every day of leap February in Monday-first full weeks", () => {
  const dates = monthDates(2028, 1);
  assert.equal(dates[0].getDay(), 1);
  assert.equal(dates.at(-1).getDay(), 0);
  assert.equal(dates.length % 7, 0);
  assert.equal(dates.filter((date) => date.getMonth() === 1).length, 29);
  assert.equal(new Set(dates.map(dateKey)).size, dates.length);
});

test("month navigation crosses years and can render six-week months", () => {
  assert.equal(monthDates(2026, 10).length, 42);
  const january = monthDates(2026, 12);
  assert.ok(january.some((date) => dateKey(date) === "2027-1-1"));
  assert.equal(dateKey(january[0]), "2026-12-28");
});

test("calendar selection finds the correct saved week across month and year boundaries", () => {
  const base = new Date(2026, 11, 28);
  assert.equal(weekOffset(base, new Date(2027, 0, 3)), 0);
  assert.equal(weekOffset(base, new Date(2027, 0, 4)), 1);
  assert.equal(weekOffset(base, new Date(2026, 11, 27)), -1);
  assert.equal(dateKey(mondayOf(new Date(2027, 0, 3))), "2026-12-28");
});
