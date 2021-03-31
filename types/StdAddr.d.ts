declare interface IStdAddrBase {
  country: string
  city: string
  name: string
  unit: string
  state: string
  predir: string
  suftype: string
  postcode: string
  house_num: string
  building: string
  qual: string
  pretype: string
  sufdir: string
  ruralroute: string
  extra: string
  box: string
  unit: string
}

declare interface IStdAddr extends IStdAddrBase {
  line1: string
  line2: string
  full: string
}
