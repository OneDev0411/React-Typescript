const zeroFill = (i: number) => {
  return (i < 10 ? '0' : '') + i
}

// Convert locat date to first moment of the day in UTC format
export const getUtcFirstMomentOfDay = (date: Date) => {
  return `${date.getFullYear()}-${zeroFill(date.getMonth() + 1)}-${zeroFill(
    date.getDate()
  )}T00:00:00Z`
}

// Convert locat date to last moment of the day in UTC format
export const getUtcLastMomentOfDay = (date: Date) => {
  return `${date.getFullYear()}-${zeroFill(date.getMonth() + 1)}-${zeroFill(
    date.getDate()
  )}T23:59:59Z`
}

// Convert utc date to js date
export const utcToDate = (utc: string) => {
  const year = Number(utc.substring(0, 4))
  const month = Number(utc.substring(5, 7)) - 1
  const day = Number(utc.substring(8, 10))

  return new Date(year, month, day)
}
