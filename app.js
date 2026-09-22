(function () {
  "use strict";

  var STORAGE_KEY = "keto-tyzden-2026-09-21";
  var DAY_KEY = "keto-tyzden-days-open";

  function loadChecks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveChecks(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* quota / private mode */
    }
  }

  function loadDays() {
    try {
      var raw = localStorage.getItem(DAY_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveDays(state) {
    try {
      localStorage.setItem(DAY_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }

  /* ----- Checkboxes ----- */
  var state = loadChecks();
  var boxes = document.querySelectorAll('input[type="checkbox"][data-key]');

  boxes.forEach(function (input) {
    var key = input.getAttribute("data-key");
    if (state[key]) {
      input.checked = true;
    }
    input.addEventListener("change", function () {
      state[key] = input.checked;
      saveChecks(state);
    });
  });

  var resetBtn = document.getElementById("reset-checks");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      boxes.forEach(function (input) {
        input.checked = false;
        state[input.getAttribute("data-key")] = false;
      });
      saveChecks(state);
    });
  }

  /* ----- Day expand/collapse ----- */
  var dayState = loadDays() || {};
  var toggles = document.querySelectorAll(".day__toggle");

  toggles.forEach(function (btn) {
    var day = btn.closest(".day");
    var id = day && day.getAttribute("data-day");
    if (!id) return;

    /* default: all open; restore if user collapsed */
    if (Object.prototype.hasOwnProperty.call(dayState, id)) {
      btn.setAttribute("aria-expanded", dayState[id] ? "true" : "false");
    }

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      dayState[id] = !open;
      saveDays(dayState);
    });
  });
})();
