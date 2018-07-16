export default `
<html>
<head>
<style>

  *, *:before, *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  body {
    width: 6.25in;
    height: 4.25in;
    margin: 0;
    padding: 0;
    background-color: white;
  }

  /* do not put text outside of the safe area */
  #safe-area {
    position: absolute;
    width: 5.875in;
    height: 3.875in;
    left: 0.1875in;
    top: 0.1875in;
  }

  #logo {
    height: 1.05in;
    position: absolute;
    right: .2in;
    top: .2in;
  }

  #box {
    position: absolute;
    top: 0;
    left: 0;
    width: 2.45in;
    height: 100%;
    background-color: #1285af;
  }

  #portrait {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  #info {
    font-family: 'Source Sans Pro';
    font-weight: 700;
    font-size: .14in;
    position: absolute;
    top: 3in;
    left: .2in;
    color: white;
  }

  #name {
    font-family: 'Source Sans Pro';
    font-weight: 700;
    font-size: .19in;
  }

  #quote {
    font-family: 'Source Sans Pro';
    font-weight: 400;
    font-size: .11in;
    position: absolute;
    top: 2in;
    background-color: white;
    padding: .1in;
    border-radius: .06in;
    margin: .2in;
  }

  b {
    color: #1285af;
  }

</style>
</head>

<body>

  <!-- do not put text outside of the safe area -->
  <div id="safe-area">

    <!-- your logo here! -->
    <img src="https://s3-us-west-2.amazonaws.com/lob-assets/deluxe-logo.png" id="logo">

    <div id="box">
      <!-- agent portrait here! -->
      <img src="https://s3-us-west-2.amazonaws.com/lob-assets/victorb-portrait.jpg" id="portrait">

      <div id="quote">
        I would love to help you sell your home too! Call or email me today to schedule a <b>free consultation</b>.
      </div>

      <div id="info">
        <div id="name">Victor Binnit</div>
        (555) 555-5555<br>
        victor@deluxerealty.org
      </div>
    </div>

  </div>
</body>

</html>

`
