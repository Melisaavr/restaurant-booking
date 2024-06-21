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

export function toSentenceCase(sentence) {
  sentence = sentence.trim();

  if (sentence.length === 0) {
    return sentence;
  }

  let capitalizedSentence =
    sentence.charAt(0).toUpperCase() + sentence.slice(1);

  return capitalizedSentence;
}
