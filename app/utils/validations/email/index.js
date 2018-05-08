export const isEmail = email => {
  if (typeof email === 'string' && email.trim()) {
    const regular = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const result = new RegExp(regular).exec(email)

    if (result == null) {
      return 'Invalid Email!'
    }
  }
}
