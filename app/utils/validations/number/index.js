export const isNumber = number => {
  if (number) {
    const regular = /^(\d*\.)?\d+$/gim

    const result = new RegExp(regular).exec(number)

    if (result == null) {
      return 'Just positive decimal numbers are valid. Like 13 and 200.00'
    }
  }
}
