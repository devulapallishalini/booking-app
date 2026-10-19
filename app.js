(function () {
  "use strict";

  const STORAGE_KEY = "bookings";
  const TIME_SLOTS = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
  ];

  const form = document.getElementById("booking-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const dateInput = document.getElementById("date");
  const timeSelect = document.getElementById("time");
  const message = document.getElementById("form-message");
  const list = document.getElementById("booking-list");
  const emptyState = document.getElementById("empty-state");
  const countBadge = document.getElementById("booking-count");

  let bookings = loadBookings();

  // --- Storage ---

  function loadBookings() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function saveBookings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      showMessage("Could not save to localStorage. Bookings will be lost on refresh.", "error");
    }
  }

  // --- Helpers ---

  function todayString() {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  }

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isSlotTaken(date, time) {
    return bookings.some((b) => b.date === date && b.time === time);
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = "message" + (type ? " " + type : "");
  }

  // --- Rendering ---

  function renderTimeSlots() {
    const selected = timeSelect.value;
    const date = dateInput.value;
    timeSelect.innerHTML = '<option value="">Select a time</option>';

    TIME_SLOTS.forEach((slot) => {
      const option = document.createElement("option");
      option.value = slot;
      const taken = date && isSlotTaken(date, slot);
      option.textContent = taken ? `${slot} (booked)` : slot;
      option.disabled = Boolean(taken);
      timeSelect.appendChild(option);
    });

    if (selected && !(date && isSlotTaken(date, selected))) {
      timeSelect.value = selected;
    }
  }

  function renderBookings() {
    list.innerHTML = "";

    const sorted = [...bookings].sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time)
    );

    sorted.forEach((booking) => {
      const li = document.createElement("li");
      li.className = "booking-item";

      const info = document.createElement("div");
      info.className = "booking-info";

      const name = document.createElement("p");
      name.className = "booking-name";
      name.textContent = booking.name;

      const when = document.createElement("p");
      when.className = "booking-meta";
      when.textContent = `${formatDate(booking.date)} at ${booking.time}`;

      const email = document.createElement("p");
      email.className = "booking-meta";
      email.textContent = booking.email;

      info.append(name, when, email);

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "btn btn-danger";
      cancelBtn.textContent = "Cancel";
      cancelBtn.setAttribute("aria-label", `Cancel booking for ${booking.name}`);
      cancelBtn.addEventListener("click", () => cancelBooking(booking.id));

      li.append(info, cancelBtn);
      list.appendChild(li);
    });

    countBadge.textContent = bookings.length;
    emptyState.hidden = bookings.length > 0;
  }

  // --- Actions ---

  function cancelBooking(id) {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    if (!confirm(`Cancel the booking for ${booking.name}?`)) return;

    bookings = bookings.filter((b) => b.id !== id);
    saveBookings();
    renderBookings();
    renderTimeSlots();
    showMessage("Booking cancelled.", "success");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const date = dateInput.value;
    const time = timeSelect.value;

    if (!name || !email || !date || !time) {
      showMessage("Please fill in all fields.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }
    if (date < todayString()) {
      showMessage("Please choose a date that is today or later.", "error");
      return;
    }
    if (isSlotTaken(date, time)) {
      showMessage("That time slot is already booked. Please pick another.", "error");
      return;
    }

    bookings.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name,
      email,
      date,
      time,
    });
    saveBookings();

    form.reset();
    renderBookings();
    renderTimeSlots();
    showMessage(`Booked ${formatDate(date)} at ${time} for ${name}.`, "success");
  }

  // --- Init ---

  dateInput.min = todayString();
  dateInput.addEventListener("change", renderTimeSlots);
  form.addEventListener("submit", handleSubmit);

  renderTimeSlots();
  renderBookings();
})();
