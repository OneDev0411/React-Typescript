export const getTimes = () => {
  const times = []

  const pad = x => (x < 10 ? `0${x}` : x.toString())

  for (let i = 0; i <= 23; i++) {
    for (let j = 0; j < 4; j++) {
      const hour = i === 12 ? '12' : pad(i % 12)
      const minute = pad(j * 15)
      const ampm = i < 12 ? 'AM' : 'PM'
      const timestamp = i * 3600 + j * 15 * 60

      times.push({
        value: timestamp,
        title: `${hour}:${minute} ${ampm}`
      })
    }
  }

  return times
}
