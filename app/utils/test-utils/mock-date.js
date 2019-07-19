export const RealDate = Date

function mockDate(isoDate) {
  global.Date = class extends RealDate {
    constructor() {
      return new RealDate(isoDate)
    }
  }
}

export default mockDate
