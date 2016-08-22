import { PhoneNumberUtil } from 'google-libphonenumber'
const phoneUtil = PhoneNumberUtil.getInstance()

export default {
  randomString: (len, charSet) => {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var randomString = '';
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
  },
  getParameterByName: (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },
  prepareToken: (token) => {
    return decodeURIComponent(token).replace(' ', '+');
  },
  convertDateToTime: function(date) {
    var date_arr = date.split('-');
    var time = new Date(date_arr[0],(date_arr[1] - 1),date_arr[2]).getTime()/1000
    return time;
  },
  friendlyDate: function(seconds_timestamp) {
    var a = new Date(seconds_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var day = days[a.getDay()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time_friendly = this.getTime(a);
    var time = {
      day: day,
      date: date,
      month: month,
      year: year,
      hour: hour,
      min: min,
      sec: sec,
      time_friendly: time_friendly
    }
    return time;
  },
  getTimeAgo: function(time){
    var units = [
      { name: "second", limit: 60, in_seconds: 1 },
      { name: "minute", limit: 3600, in_seconds: 60 },
      { name: "hour", limit: 86400, in_seconds: 3600  },
      { name: "day", limit: 604800, in_seconds: 86400 },
      { name: "week", limit: 2629743, in_seconds: 604800  },
      { name: "month", limit: 31556926, in_seconds: 2629743 },
      { name: "year", limit: null, in_seconds: 31556926 }
    ];
    var diff = (new Date() - new Date(time*1000)) / 1000;
    if (diff < 5) return "now";
    
    var i = 0, unit;
    while (unit = units[i++]) {
      if (diff < unit.limit || !unit.limit){
        var diff =  Math.floor(diff / unit.in_seconds);
        return diff + " " + unit.name + (diff>1 ? "s" : "");
      }
    };
  },
  getTime: function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;
    return strTime;
  },
  getYMD(timestamp){
    let date = new Date()
    if(timestamp)
      date = new Date(timestamp)
    return `${date.getFullYear()}-${ ('0' + (date.getMonth() + 1)).slice(-2) }-${('0' + date.getDate()).slice(-2)}`
  },
  numberWithCommas: (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  getDaysFromMiliseconds: (miliseconds) => {
    return Math.floor(parseInt(miliseconds) / 86400000)
  },
  isValidPhoneNumber: (phone_number) => {
    if(phone_number.trim() && phoneUtil.isValidNumber(phoneUtil.parse(phone_number)))
      return true
    return false
  },
  imageExists: (url) => {
    var img = new Image();
    img.src = url;
    return img.height != 0;
  },
  addTimeToDate(date_object, hours, minutes, suffix) {
    let date_miliseconds = date_object.getTime() // in miliseconds
    // Get time
    if (hours === 0)
      hours = 12
    if (suffix === 'PM' && hours !== 12)
      hours = hours + 12
    if (suffix === 'AM' && hours === 12)
      hours = 0
    const seconds_after_midnight = (hours * 60 * 60) + (minutes * 60)
    const miliseconds = date_miliseconds + (seconds_after_midnight * 1000)
    return miliseconds
  },
  parsePhoneNumber(phone_number) {
    if(phone_number && phoneUtil.isPossibleNumberString(phone_number)) {
      const values = phoneUtil.parse(phone_number).values_
      return {
        country_code: values[1],
        phone_number: values[2]
      }
    }
    return {
      country_code: 1,
      phone_number
    }
  }
}