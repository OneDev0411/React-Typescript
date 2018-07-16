export const isNumber = number => {
  if (number) {
    const regular = /^(\d*\.)?\d+$/igm 

    const result = new RegExp(regular).exec(number)

    console.log(typeof number, number);

    if (result == null) {
      return 'Just positive decimal numbers are valid. Like 13 and 200.00'
    }
  }
}
