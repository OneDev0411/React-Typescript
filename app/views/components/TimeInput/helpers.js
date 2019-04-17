// ---------- Internal ---------- //
function isPM(date) {
  const lastHours = date.getHours()

  return lastHours >= 12
}

// ---------- useTime helpers ---------- //

// Getting a 12-hour time and generate a 24-hour time
// Useful for setting hours in Date()
export function changeHours(date, to) {
  if (isPM(date) && to == 12) {
    return 12
  }

  if (!isPM(date) && to == 12) {
    return 0
  }

  return isPM(date) ? to + 12 : to
}

// For changing a meridian of a date we just need to add/subtract 12
export function changeMeridian(date, to) {
  const lastHours = date.getHours()

  if (isPM(date) && to == 'AM') {
    return lastHours - 12
  }

  if (!isPM(date) && to == 'PM') {
    return lastHours + 12
  }

  return lastHours
}

export function getHours(date) {
  return date.getHours()
}

export function getMinutes(date) {
  return date.getMinutes()
}

export function getMeridian(date) {
  return getHours(date) < 12 ? 'AM' : 'PM'
}

// For checking a value be in a range we're using this function
// it gets `value` and will check to be in range of `start` & `end`
// we using a fallback value when user entring something out of range
export function inRange({ start, end, value, lastValue }) {
  if (Number.isNaN(value)) {
    return lastValue
  }

  const concatValues = Number(`${lastValue}${value}`)

  if (concatValues <= end && concatValues >= start) {
    return concatValues
  }

  if (value <= end && value >= start) {
    return value
  }

  return 0
}

// Returns meridian according to key code (keyboard event)
export function keyHandlerForMeridian(pressedKey, meridian) {
  // A key
  if (pressedKey == 65) {
    return 'AM'
  }

  // P key
  if (pressedKey == 80) {
    return 'PM'
  }

  // ArrowUp & ArrowDown
  if (['ArrowUp', 'ArrowDown', 37, 38, 39, 40].includes(pressedKey)) {
    return meridian == 'AM' ? 'PM' : 'AM'
  }

  return meridian
}

// ---------- TimeInput helpers ---------- //

// Convert 3 -> 03
export function formatNumber(num) {
  if (num < 10) {
    return `0${num}`
  }

  return num
}

// ---------- Shared ---------- //

// Getting an 24-hour time and returns a 12-hour time (only hours)
export function twelveFormat(hours) {
  if (hours == 0 || hours == 12) {
    return 12
  }

  return hours >= 12 ? hours - 12 : hours
}
