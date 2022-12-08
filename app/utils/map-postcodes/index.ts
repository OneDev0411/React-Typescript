export interface ZipcodeOption {
  id: string
  title: string
}
export const mapPostcodesToOptions = (
  postcodes: OptionalNullable<string[]>
): ZipcodeOption[] => {
  if (!postcodes) {
    return []
  }

  return postcodes.reduce((acc: ZipcodeOption[], postcode) => {
    if (!postcode || postcode.trim() === '') {
      return acc
    }

    return [
      ...acc,
      {
        id: postcode,
        title: postcode
      }
    ]
  }, [])
}
