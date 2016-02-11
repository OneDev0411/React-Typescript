export default {
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
  friendlyDate: function(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
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
  isValidPhoneNumber: (value) => {
    var phoneRe = /^[1-9]\d{2}[1-9]\d{2}\d{4}$/
    var digits = value.replace(/\D/g, '')
    return digits.match(phoneRe)
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
  }
}