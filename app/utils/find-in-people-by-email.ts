export function findInPeopleByEmail(
  people: (IContact | IAgent)[] | null,
  emailAddress: string | undefined
): IContact | IAgent | undefined {
  if (!Array.isArray(people) || typeof emailAddress !== 'string') {
    return undefined
  }

  return (
    people.find(p => p.email === emailAddress) ||
    people.find(p => p.emails!.includes(emailAddress))
  )
}
