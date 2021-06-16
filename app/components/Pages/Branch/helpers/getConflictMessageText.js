const getConfilictMessageText = email =>
  `You are currently logged in a different user.  Please sign out and sign in ${
    email ? `using ${decodeURIComponent(email)}` : 'again'
  }.`

export default getConfilictMessageText
