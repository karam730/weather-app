import { getWeather } from "./weather.js";
const API_KEY = "3e36e513bc39f7578baa035a7a9df988";
const LAT = 33.5130695;
const LON = 36.3095814;
getWeather(LAT, LON, API_KEY)
  .then(renderWeather)
  .catch((e) => {
    console.error(e);
    alert("Error getting weather");
  });

function renderWeather({ current, daily, hourly }) {
  renderCurrent(current);
  renderHourly(hourly);
  renderDaily(daily);
  document.body.classList.remove("blurred");
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function setIcon(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).src = `icons/${value}.svg`;
}

function renderCurrent(currnet) {
  setValue("crnt-date", currnet.currentDate);
  setIcon("crnt-icon", currnet.iconCode);
  setValue("crnt-temp", currnet.currentTemp);
  setValue("crnt-temp-desc", currnet.currentTempDesc);
  setValue("crnt-high", currnet.high);
  setValue("crnt-wind", currnet.wind);
  setValue("crnt-sunrise", currnet.sunRise);
  setValue("crnt-low", currnet.low);
  setValue("crnt-pop", currnet.pop);
  setValue("crnt-sunset", currnet.sunSet);
}

const houtrlySection = document.querySelector("[data-hourly-section]");
const hourCardTemplat = document.querySelector("[data-hour-card]");

function renderHourly(hourly) {
  const towntyFourHours = hourly.slice(1, 25);
  houtrlySection.innerHTML = "";
  towntyFourHours.forEach((hour) => {
    const element = hourCardTemplat.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: element });
    setValue("hour", hour.timeStamp, { parent: element });
    setIcon("icon", hour.iconCode, { parent: element });
    houtrlySection.append(element);
  });
}

const dailySection = document.querySelector("[data-next-days]");
const dayCardtemplate = document.querySelector("[data-day-card]");
function renderDaily(daily) {
  const nextSixDays = daily.slice(1, 7);
  dailySection.innerHTML = "";
  nextSixDays.forEach((day) => {
    const element = dayCardtemplate.content.cloneNode(true);
    setValue("day", day.dayName, { parent: element });
    setValue("date", day.dayMonth, { parent: element });
    setValue("low", day.low, { parent: element });
    setValue("low-small", day.low, { parent: element });
    setValue("high", day.high, { parent: element });
    setValue("high-small", day.high, { parent: element });
    setValue("wind", day.windSpeed, { parent: element });
    setValue("pop", day.pop, { parent: element });
    setIcon("icon", day.iconCode, { parent: element });
    dailySection.append(element);
  });
}
