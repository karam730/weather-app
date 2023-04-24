export function getWeather(lat, lon, key) {
  return  axios.get("https://api.openweathermap.org/data/2.5/onecall?exclude=minutely,alerts&units=metric", {
        params: {
            lat: lat,
            lon: lon,
            appid: key
    }
  })
    .then(({ data }) => {
    return {
      hourly: parsHourlytWeather(data),
      current: parsCurrentWeather(data),
      daily: parsDailyWeather(data),
  }
})
}

function parsCurrentWeather({ current, daily }) {
  const { temp :currentTemp ,dt :currentDate } = current;
  const iconCode = current.weather[0].icon;
  const currentTempDesc = current.weather[0].description;
  const { pop: pop, wind_speed: wind, sunrise: sunRise, sunset: sunSet } = daily[0];
  const { max: high , min: low} = daily[0].temp;

  return {
    currentDate : new Intl.DateTimeFormat('en-GB' ,{weekday:"long" ,day: "numeric", month: "long"}).format(currentDate * 1000),
    iconCode,
    currentTemp: Math.round(currentTemp),
    currentTempDesc,
    high: Math.round(high),
    low: Math.round(low),
    wind: Math.round(wind),
    pop: Math.round(pop * 100) / 100,
    sunRise: formatSunRisSunSet(sunRise),
    sunSet: formatSunRisSunSet(sunSet),
  }
}

function parsHourlytWeather({hourly}) {
 return hourly.map((hour) => {
    return {
      timeStamp: formatAMPM(hour.dt),
      iconCode: hour.weather[0].icon,
      temp: Math.round(hour.temp)
    }
  })
}

function parsDailyWeather({ daily }) {
  return daily.map(day => {
    const date = new Date(day.dt * 1000)
    return {
      dayName: new Intl.DateTimeFormat('en-GB', { weekday: "short" }).format(date),
      dayMonth: dayMonthTimeConv(day.dt),
      iconCode: day.weather[0].icon ,
      low: Math.round(day.temp.min),
      high: Math.round(day.temp.max),
      windSpeed: Math.round(day.wind_speed),
      pop: Math.round((day.pop * 100) / 100)
    }
  })
}

function formatAMPM(next_houer) {
    let convHour = new Date(next_houer * 1000);
    let hours = convHour.getHours();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let strTime = hours + ampm;
    return strTime;
}

function formatSunRisSunSet(date) {
  const time = new Date(date * 1000)
  let hours = time.getHours();
  let min = time.getMinutes();
  let hoursLength = [...hours.toString()].length;
  let minLength = [...min.toString()].length;
  if (hoursLength === 1) {
    hours = `0${hours}`
  }
  if (minLength === 1) {
    min = `0${min}`
  } 
  const fullTime = `${hours}:${min}`
  return fullTime

}

// return date like day/month 30/1
function dayMonthTimeConv(UNIX_time) {
    let convToDayMonth = new Date(UNIX_time * 1000);
    let month = convToDayMonth.getMonth() + 1;
    let days = convToDayMonth.getDate();
    let dayMonth = days + "/" + month;
    return dayMonth;
}

// parsHourlytWeather