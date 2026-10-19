# Simple Booking App

A small appointment booking app that runs entirely in the browser. It is
built with plain HTML, CSS and JavaScript: no frameworks, no build step and
no backend.

## Features

- **Book an appointment** with your name, email, date and time slot.
- **See all bookings** in a list, sorted by date and time.
- **Bookings are saved** in the browser's `localStorage`, so they are still
  there after you refresh or reopen the page.
- **Cancel a booking** with the Cancel button next to it.
- **No double-booking:** a time slot that is already booked on the chosen
  date is shown as "(booked)" and can't be selected.
- **Checks your input:** every field is required, the email must look valid,
  and dates in the past are not allowed.
- **Works on phones:** the layout is one column on small screens and two
  columns on wider ones.

## Files

| File         | Purpose                                         |
| ------------ | ----------------------------------------------- |
| `index.html` | Entry page: the booking form and bookings list  |
| `styles.css` | Styles, including the mobile-friendly layout    |
| `app.js`     | Form handling, rendering and localStorage logic |

## How to run

**Option 1: open the file.** Double-click `index.html`, or drag it into a
browser window.

**Option 2: use a local web server** (optional), from this folder:

```bash
# Python 3
python -m http.server 8000

# or Node.js
npx serve .
```

Then go to <http://localhost:8000> (or the address `serve` prints).

## Notes

- Bookings are stored only in **this browser on this device**. Another
  browser, another device or a private window will not show them.
- Clearing your browser's site data deletes the bookings.
- To change the available time slots, edit the `TIME_SLOTS` array at the top
  of `app.js`.
