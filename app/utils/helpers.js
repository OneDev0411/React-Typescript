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
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time_friendly = this.getTime(a);
    var time = {
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
  numberWithCommas: (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}