// for chart1

// weakely flow 

function chart1calling() {
  const api_url = "https://api.thingspeak.com/channels/1936930/feeds.json?api_key=PKYCLS8M7YCBSM33&timezone=Asia%2FKolkata";

  const labels = [""];
  const data = {
    labels: labels,
    datasets: [{
      label: 'Watersensor',
      backgroundColor: 'rgb(0, 99, 132)',
      borderColor: 'rgb(250, 80, 136 )',
      data: [],
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
  var flag=0;
  async function flowrate() {
    const response = await fetch(api_url);
    const data1 = await response.json();
    var n = data1["feeds"].length ;
    var date = data1["feeds"][n-1]["created_at"].substring(0,10);
    var new_api = api_url + "&start="+date;
    if(flag==0){
      const response1 = await fetch(new_api);
      const data2 = await response1.json();
      var n1=data2["feeds"].length ; 
      i=0;
      while(i<n1){
        var a1 = data2["feeds"][i]["created_at"];
        a1 = a1.substring(11, 16); // ig its hours and seconds
        var b1 = data2["feeds"][i]["field1"];
        myChart.data.datasets[0].data.push(b1);
        myChart.data.labels.push(a1);
        myChart.update();
        i++;
      }
      flag=1;
    }
    else{
      var a = data1["feeds"][n-1]["created_at"];
      a = a.substring(11, 16); // ig its hours and seconds
      var b = data1["feeds"][n-1]["field1"];
      myChart.data.datasets[0].data.push(b);
      myChart.data.labels.push(a);
      myChart.update();
    }
  }
  flowrate();
  const myInterval = setInterval(flowrate, 15000); // 30 seconds 

  document.getElementById('input-date').addEventListener("click", myfunction1);

  
  async function myfunction1() {
    document.getElementById("input-date").innerHTML = "Submit";
    clearInterval(myInterval);
    var x = document.getElementById('input-from-date').value;
    var y = document.getElementById('input-to-date').value;
    var appending_string ="&start=" + x + "&end=" + y+"&average=10";
    appending_string = api_url + appending_string;
    console.log(appending_string);
    myChart.data.labels.length = 0;
    myChart.data.datasets[0].data.length=0;
    const response = await fetch(appending_string);
    const data1 = await response.json();
    i = 0;
    var size =data1["feeds"].length; 
    while (i<size) {
      var a = data1["feeds"][i]["created_at"];
      a = a.substring(11, 16); // ig its hours and seconds
      var b = data1["feeds"][i]["field1"];
      myChart.data.datasets[0].data.push(b);
      myChart.data.labels.push(a);
      myChart.update();
      i++;
    }
    
  }
}
chart1calling();

function chart2calling() {
  const api_url = "https://api.thingspeak.com/channels/1936930/feeds.json?api_key=PKYCLS8M7YCBSM33&timezone=Asia%2FKolkata";

  const labels = [""];
  const data = {
    labels: labels,
    datasets: [{
      label: 'Watersensor',
      backgroundColor: 'rgb(0, 255, 12 )',
      borderColor: 'rgb(0, 99, 132)',
      data: [],
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
  var flag=0;
  async function flowrate() {
    const response = await fetch(api_url);
    const data1 = await response.json();
    var n = data1["feeds"].length ;
    var date = data1["feeds"][n-1]["created_at"].substring(0,10);
    var new_api = api_url + "&start="+date+"&average=10";
    if(flag==0){
      const response1 = await fetch(new_api);
      const data2 = await response1.json();
      var n1=data2["feeds"].length ; 
      i=0;
      while(i<n1){
        var a1 = data2["feeds"][i]["created_at"];
        a1 = a1.substring(11, 16); // ig its hours and seconds
        var b1 = data2["feeds"][i]["field2"];
        b1=b1.toString().substring(0,5);
        myChart.data.datasets[0].data.push(b1);
        myChart.data.labels.push(a1);
        myChart.update();
        i++;
      }
      flag=1;
    }
    else{
      var a = data1["feeds"][n-1]["created_at"];
      a = a.substring(11, 16); // ig its hours and seconds
      var b = data1["feeds"][n-1]["field2"];
      myChart.data.datasets[0].data.push(b);
      myChart.data.labels.push(a);
      myChart.update();
    }
  }

  const myInterval = setInterval(flowrate, 15000); // 15 seconds 
  flowrate();

  document.getElementById('input-date1').addEventListener("click", myfunction2);

  async function myfunction2() {

    document.getElementById("input-date1").innerHTML = "Submit";
    clearInterval(myInterval);
    var x = document.getElementById('input-from-date1').value;
    var y = document.getElementById('input-to-date1').value;
    var appending_string ="&average=10"+"&start=" + x + "&end=" + y;
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

function chart3calling() {
  const api_url = "https://api.thingspeak.com/channels/1936930/feeds.json?api_key=PKYCLS8M7YCBSM33&timezone=Asia%2FKolkata";

  const labels = [""];
  const data = {
    labels: labels,
    datasets: [{
      label: 'Watersensor',
      backgroundColor: 'rgb(218, 27, 27 )',
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
    document.getElementById('myChart3'),
    config
  );

  async function flowrate() {
    const response = await fetch(api_url+"&results=1580&average=60"); // showing results for last 24 hours
    const data1 = await response.json();
    var n=data1["feeds"].length; 
    i=0;
    for(i=1;i<n;i++){
      console.log("hello");
        var a = data1["feeds"][i]["created_at"];
        a = a.substring(11, 16); // ig its hours and seconds
        var b = parseFloat(data1["feeds"][i]["field2"])-parseFloat(data1["feeds"][i-1]["field2"]); // getting the current data
        if(b<0){
          b=0;
        }
        b=b.toString().substring(0,5);
        myChart.data.datasets[0].data.push(b);
        myChart.data.labels.push(a);
    }
    myChart.update();
  }
  flowrate(); // 15 seconds 

}

chart3calling();