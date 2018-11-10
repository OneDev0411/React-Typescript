export const days = [...Array(32).keys()].map(day => {
  const _day = day + 1;
  return _day < 10 ? `0${_day}` : _day.toString()
})
