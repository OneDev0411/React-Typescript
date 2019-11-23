function isContact(input: IContact | IAgent): input is IContact {
    return input.type === 'contact'
}

export function getRecipientNameByEmail(
    recipients: (IContact | IAgent)[] | null,
    emailAddress: string | undefined
): string | undefined {
    if (!Array.isArray(recipients) || typeof (emailAddress) !== 'string') {
        return undefined
    }

    const recipient = recipients.find(p => p.emails!.includes(emailAddress))

    if (recipient) {
        if (isContact(recipient)) {
            return recipient.display_name
        }

        return `${recipient.first_name} ${recipient.last_name}`
    }

    return undefined
}