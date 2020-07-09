export function getDefaultSelectedAccount(
  allAccounts: IOAuthAccount[],
  preferredAccountId: UUID
) {
  const account =
    allAccounts.find(
      account => !preferredAccountId || account.id === preferredAccountId
    ) || allAccounts[0]

  return account
}
