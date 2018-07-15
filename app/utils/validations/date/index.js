export const isFormatedDate = date => {
  if (typeof date === 'string' && date.trim()) {

    const regular = /^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/

    const result = new RegExp(regular).exec(date)

    if (result == null) {
      return 'Please enter a valid date format (MM/DD/YYYY).'
    }
  }
}
