import moment from "moment";

export function getFullDayName(shortDay) {
  const daysMap = {
    MON: "Monday",
    TUE: "Tuesday",
    WED: "Wednesday",
    THU: "Thursday",
    FRI: "Friday",
    SAT: "Saturday",
    SUN: "Sunday",
  };

  return daysMap[shortDay.toUpperCase()] || "Invalid day abbreviation";
}

export function convertTimeFormat(timeString) {
  return moment(timeString, "HH:mm:ss").format("h:mm A");
}
