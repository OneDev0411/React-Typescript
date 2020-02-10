export interface ContactInfo {
  name?: string
  address: string
  profileImageUrl?: string
  me: boolean
}

export default function getContactInfoFromEmailThread(
  user: IUser,
  emailThread: IEmailThread<'messages' | 'contacts'>
): ContactInfo[] {
  type ContactOrAddress = string | NonNullable<typeof contacts>[number]

  const { messages, contacts } = emailThread
  const processedContactOrAddresses: ContactOrAddress[] = []
  const addressNameDictionary: { [address: string]: string } = {}
  const result: ContactInfo[] = []

  messages.forEach(message => {
    const contactOrAddresses =
      message.type === 'email'
        ? getContactOrAddressesFromEmail(message)
        : getContactOrAddressesFromEmailBase(message)

    contactOrAddresses.forEach(c => {
      if (!processedContactOrAddresses.includes(c)) {
        processedContactOrAddresses.push(c)

        const contactInfo = getContactInfoFromContactOrAddress(c)
        const matchedContactInfo = result.find(
          i => i.name && i.name === contactInfo.name
        )

        if (matchedContactInfo) {
          matchedContactInfo.address =
            matchedContactInfo.address || contactInfo.address
          matchedContactInfo.profileImageUrl =
            matchedContactInfo.profileImageUrl || contactInfo.profileImageUrl
          matchedContactInfo.me = matchedContactInfo.me || contactInfo.me
        } else {
          result.push(contactInfo)
        }
      }
    })

    function getContactOrAddressesFromEmail(
      message: IEmail
    ): ContactOrAddress[] {
      return [message.from, ...message.to].map(getContactOrAddressFromAddress)
    }
    function getContactOrAddressesFromEmailBase(
      message: IGoogleMessage | IMicrosoftMessage
    ): ContactOrAddress[] {
      const rawRecipients: IRawEmailRecipient[] = [
        message.from_raw,
        ...message.to_raw
      ]

      rawRecipients.forEach(
        ({ name, address }) =>
          address in addressNameDictionary ||
          (addressNameDictionary[address] = name)
      )

      return rawRecipients.map(({ address }) =>
        getContactOrAddressFromAddress(address)
      )
    }
    function getContactOrAddressFromAddress(address: string): ContactOrAddress {
      return (
        (contacts &&
          contacts.find(c => c.emails && c.emails.includes(address))) ||
        address
      )
    }
    function getContactInfoFromContactOrAddress(
      contactOrAddress: ContactOrAddress
    ): ContactInfo {
      if (typeof contactOrAddress === 'string') {
        return {
          name:
            contactOrAddress in addressNameDictionary
              ? addressNameDictionary[contactOrAddress]
              : undefined,
          address: contactOrAddress,
          me: contactOrAddress === user.email
        }
      }

      return {
        name:
          addressNameDictionary[contactOrAddress.email] ||
          contactOrAddress.display_name,
        address: contactOrAddress.email,
        profileImageUrl: contactOrAddress.profile_image_url,
        me:
          contactOrAddress.email === user.email ||
          (!!contactOrAddress.emails &&
            contactOrAddress.emails.includes(user.email))
      }
    }
  })

  return result
}
