# Datum

## Library für Datum anzeige

## Install

Im Terminal eingeben:

```js
npm install moment --save   # npm
yarn add moment             # Yarn
spm install moment --save   # spm
meteor add momentjs:moment  # meteor
bower install moment --save # bower (deprecated)
```

## moment.js nutzen "US":

### Format Dates

```js
moment().format("MMMM Do YYYY, h:mm:ss a"); // February 15th 2026, 2:28:38 pm
moment().format("dddd"); // Sunday
moment().format("MMM Do YY"); // Feb 15th 26
moment().format("YYYY [escaped] YYYY"); // 2026 escaped 2026
moment().format(); // 2026-02-15T14:28:38+01:00
```

### Relative Time

```js
moment("20111031", "YYYYMMDD").fromNow(); // 14 years ago
moment("20120620", "YYYYMMDD").fromNow(); // 14 years ago
moment().startOf("day").fromNow(); // 14 hours ago
moment().endOf("day").fromNow(); // in 10 hours
moment().startOf("hour").fromNow(); // 29 minutes ago
```

### Calendar Time

```js
moment().subtract(10, "days").calendar(); // 02/05/2026
moment().subtract(6, "days").calendar(); // Last Monday at 2:28 PM
moment().subtract(3, "days").calendar(); // Last Thursday at 2:28 PM
moment().subtract(1, "days").calendar(); // Yesterday at 2:28 PM
moment().calendar(); // Today at 2:28 PM
moment().add(1, "days").calendar(); // Tomorrow at 2:28 PM
moment().add(3, "days").calendar(); // Wednesday at 2:28 PM
moment().add(10, "days").calendar(); // 02/25/2026
```

### Multiple Locale Support

```js
moment.locale(); // en
moment().format("LT"); // 2:28 PM
moment().format("LTS"); // 2:28:38 PM
moment().format("L"); // 02/15/2026
moment().format("l"); // 2/15/2026
moment().format("LL"); // February 15, 2026
moment().format("ll"); // Feb 15, 2026
moment().format("LLL"); // February 15, 2026 2:28 PM
moment().format("lll"); // Feb 15, 2026 2:28 PM
moment().format("LLLL"); // Sunday, February 15, 2026 2:28 PM
moment().format("llll");
```

## moment.js nutzen "DEU":

### Format Dates

```js
moment().format("MMMM Do YYYY, h:mm:ss a"); // Februar 15. 2026, 2:31:29 pm
moment().format("dddd"); // Sonntag
moment().format("MMM Do YY"); // Feb. 15. 26
moment().format("YYYY [escaped] YYYY"); // 2026 escaped 2026
moment().format(); // 2026-02-15T14:31:29+01:00
```

### Relative Time

```js
moment("20111031", "YYYYMMDD").fromNow(); // vor 14 Jahren
moment("20120620", "YYYYMMDD").fromNow(); // vor 14 Jahren
moment().startOf("day").fromNow(); // vor 15 Stunden
moment().endOf("day").fromNow(); // in 9 Stunden
moment().startOf("hour").fromNow();
```

### Calendar Time

```js
moment().subtract(10, "days").calendar(); // 05.02.2026
moment().subtract(6, "days").calendar(); // letzten Montag um 14:32 Uhr
moment().subtract(3, "days").calendar(); // letzten Donnerstag um 14:32 Uhr
moment().subtract(1, "days").calendar(); // gestern um 14:32 Uhr
moment().calendar(); // heute um 14:32 Uhr
moment().add(1, "days").calendar(); // morgen um 14:32 Uhr
moment().add(3, "days").calendar(); // Mittwoch um 14:32 Uhr
moment().add(10, "days").calendar();
```

### Multiple Locale Support

```js
moment.locale(); // de
moment().format("LT"); // 14:32
moment().format("LTS"); // 14:32:37
moment().format("L"); // 15.02.2026
moment().format("l"); // 15.2.2026
moment().format("LL"); // 15. Februar 2026
moment().format("ll"); // 15. Feb. 2026
moment().format("LLL"); // 15. Februar 2026 14:32
moment().format("lll"); // 15. Feb. 2026 14:32
moment().format("LLLL"); // Sonntag, 15. Februar 2026 14:32
moment().format("llll");
```
