export const splitFullName = (fullName: string) => {
  const parts = fullName.split(' ')

  return {
    first_name: parts[0],
    last_name: parts[1]
  }
}
