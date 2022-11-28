// for chart1

function chart1calling() {
  const api_url = "https://api.thingspeak.com/channels/1769038/feeds.json?api_key=HBSVWRWHIWMD0EV1";

  const labels = [""];
  const data = {
    labels: labels,
    datasets: [{
      label: 'Watersensor',
      backgroundColor: 'rgb(0, 99, 132)',
      borderColor: 'rgb(0, 99, 132)',
      data: [0],
    }]
  };
  const config = {
    type: 'line',
    data: data,
    options: {}
  };
  const myChart = new Chart(
    document.getElementById('myChart1'),
    config
  );



  let i = 0;
  async function flowrate() {
    const response = await fetch(api_url);
    const data1 = await response.json();
    var a = data1["feeds"][0]["created_at"];
    console.log(a);
    a = a.substring(11, 16); // ig its hours and seconds
    var b = data1["feeds"][0]["field1"];
    console.log(a, b);
    i++;
    myChart.data.datasets[0].data.push(b);
    myChart.data.labels.push(a);
    myChart.update();

  }
  const myInterval = setInterval(flowrate, 15000); // 30 seconds 

  document.getElementById('input-date').addEventListener("click", myfunction1);

  async function myfunction1() {
    document.getElementById("input-date").innerHTML = "Submit";
    clearInterval(myInterval);
    var x = document.getElementById('input-from-date').value;
    var y = document.getElementById('input-to-date').value;
    var appending_string = "&average=15" + "&start=" + x + "&end=" + y;
    appending_string = api_url + appending_string;
    console.log(appending_string);
    // labels.length = 0;
    // data.length = 0;
    myChart.data.labels.length = 0;
    myChart.data.datasets[0].data.length=0;
    const response = await fetch(appending_string);
    const data1 = await response.json();
    i = 0;
    var size =data1["feeds"].length; 
    while (i < 10000 && i<size) {
      var a = data1["feeds"][i]["created_at"];
      a = a.substring(11, 16); // ig its hours and seconds
      var b = data1["feeds"][i]["field1"];
      console.log(a, b);
      myChart.data.datasets[0].data.push(b);
      myChart.data.labels.push(a);
      myChart.update();
      i++;
    }
  }
}

chart1calling();
//end for chart 1 





// for chart2

function chart2calling() {
  const api_url = "https://api.thingspeak.com/channels/1769038/feeds.json?api_key=HBSVWRWHIWMD0EV1";

  const labels = [""];
  const data = {
    labels: labels,
    datasets: [{
      label: 'Watersensor',
      backgroundColor: 'rgb(0, 99, 132)',
      borderColor: 'rgb(0, 99, 132)',
      data: [0],
    }]
  };
  const config = {
    type: 'line',
    data: data,
    options: {}
  };
  const myChart = new Chart(
    document.getElementById('myChart2'),
    config
  );


  let i = 0;
  var total_area = 0;
  var prev = 0;
  // async function flowrate() {
  //   const response = await fetch(api_url+"&results=1");
  //   const data1 = await response.json();
  //   var a = data1["feeds"][0]["created_at"];
  //   a = a.substring(11, 16); // ig its hours and seconds
  //   var b = data1["feeds"][0]["field1"]; // getting the current data
  //   prev = parseInt(prev);
  //   b = parseInt(b);
  //   var area = 0.5 * (prev + b) * 0.5 // 30 seconds  
  //   total_area = total_area + area;
  //   console.log(prev);
  //   i++;
  //   myChart.data.datasets[0].data.push(total_area);
  //   myChart.data.labels.push(a);
  //   prev = b;
  //   myChart.update();
  // }

  async function flowrate() {
    const response = await fetch(api_url+"&results=1");
    const data1 = await response.json();
    var a = data1["feeds"][0]["created_at"];
    a = a.substring(11, 16); // ig its hours and seconds
    var b = data1["feeds"][0]["field2"]; // getting the current data
    myChart.data.datasets[0].data.push(b);
    myChart.data.labels.push(a);
    myChart.update();
  }
  const myInterval = setInterval(flowrate, 15000); // 15 seconds 

  document.getElementById('input-date1').addEventListener("click", myfunction2);

  async function myfunction2() {

    document.getElementById("input-date1").innerHTML = "Submit";
    clearInterval(myInterval);
    var x = document.getElementById('input-from-date1').value;
    var y = document.getElementById('input-to-date1').value;
    var appending_string = "&average=15" + "&start=" + x + "&end=" + y;
    appending_string = api_url + appending_string;
    console.log(appending_string);
    myChart.data.labels.length = 0;
    myChart.data.datasets[0].data.length=0;
    // data.length = 0;
    const response = await fetch(appending_string);
    const data1 = await response.json();
    i = 0;
    prev = 0;
    total_area = 0;
    // while (i < 100) {

    //   var a = data1["feeds"][i]["created_at"];
    //   a = a.substring(11, 16); // ig its hours and seconds
    //   var b = data1["feeds"][i]["field1"];
    //   prev = parseInt(prev);
    //   b = parseInt(b);
    //   var area = 0.5 * (prev + b) * 0.25 // 15 seconds  
    //   total_area = total_area + area;
    //   i++;
    //   myChart.data.datasets[0].data.push(total_area);
    //   myChart.data.labels.push(a);
    //   prev = b;
    //   myChart.update();

    // }
    console.log(myChart.data.datasets[0].data);
    var size =data1["feeds"].length; 
    while (i < 10000 && i<size) {
      var a = data1["feeds"][i]["created_at"];
      a = a.substring(11, 16); // ig its hours and seconds
      var b = data1["feeds"][i]["field2"];
      myChart.data.datasets[0].data.push(b);
      myChart.data.labels.push(a);
      myChart.update();
      i++;
    }
  }
}

chart2calling();
//end for chart 2