/**
 * check year is a leap year or not
 * @param {number} year - checking year
 */

export function isLeapYear(year: number): boolean {
  const value = isNaN(year) ? year : parseInt(year as any,10)
  
  if(!value){
    return false
  }
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}
