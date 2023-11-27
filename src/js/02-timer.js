
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';

const refs = {
    startBtn: document.querySelector("[data-start]"),
    days: document.querySelector("[data-days]"),
    hours: document.querySelector("[data-hours]"),
    minutes: document.querySelector("[data-minutes]"),
    seconds: document.querySelector("[data-seconds]"),
  };
  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    const days = Math.floor(ms / day);
    
    const hours = Math.floor((ms % day) / hour);
    
    const minutes = Math.floor(((ms % day) % hour) / minute);
    
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }



  function addLeadingZero(value) {
    return String(value).padStart(2, "0");
  }const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = new Date();
    const selectedDate = selectedDates[0];

    if (selectedDate <= currentDate) {
      Notiflix.Notify.failure("Please choose a date in the future");
      refs.startBtn.setAttribute("disabled", "");
    } else {
      refs.startBtn.removeAttribute("disabled");
    }
  },
};

const fp = flatpickr("#datetime-picker", options);

let timerId = null;

refs.startBtn.addEventListener("click", () => {
  const selectedDate = fp.selectedDates[0];
  const currentDate = new Date();

  if (selectedDate > currentDate) {
    timerId = setInterval(() => {
      const selectedDate = fp.selectedDates[0];
      const currentDate = new Date();
      const timeDifference = selectedDate - currentDate;

      const { days, hours, minutes, seconds } = convertMs(timeDifference);

      refs.days.textContent = addLeadingZero(days);
      refs.hours.textContent = addLeadingZero(hours);
      refs.minutes.textContent = addLeadingZero(minutes);
      refs.seconds.textContent = addLeadingZero(seconds);

      if (timeDifference <= 0) {
        clearInterval(timerId);
        Notiflix.Notify.success("Countdown finished!");
        refs.days.textContent = "00";
        refs.hours.textContent = "00";
        refs.minutes.textContent = "00";
        refs.seconds.textContent = "00";
      }
    }, 1000);
  } else {
    Notiflix.Notify.warning("You chose the same date");
  }
});