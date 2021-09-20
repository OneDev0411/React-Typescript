const getConflictMessageText = (fromEmail, toEmail) =>
  `You are currently logged in as "${decodeURIComponent(
    fromEmail
  )}". Do you want to sign out and sign in as "${decodeURIComponent(toEmail)}"?`

export default getConflictMessageText
