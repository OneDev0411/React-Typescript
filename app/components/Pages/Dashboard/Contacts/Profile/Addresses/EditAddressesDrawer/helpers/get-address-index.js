export function getNewAddressIndex(addresses, arrayfields) {
  const addressesLength = addresses.length
  const arrayFieldsLength = arrayfields.value.length
  let currentIndex = arrayFieldsLength + 1

  const AllAddressesHaveIndex = addresses.every(
    address => address.index != null
  )

  if (addressesLength < 2 || !AllAddressesHaveIndex) {
    return currentIndex
  }

  const getCurrentIndex = (a, b) => (a.index >= b.index ? a.index : b.index)

  if (AllAddressesHaveIndex) {
    currentIndex = addresses.reduce(getCurrentIndex)
  } else {
    currentIndex = addresses
      .filter(a => a.index != null)
      .reduce(getCurrentIndex)
  }

  return currentIndex + (arrayFieldsLength - addressesLength) + 1
}
