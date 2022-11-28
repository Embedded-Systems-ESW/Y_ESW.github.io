// Average daily flow 
function AvgFlow() {
  const api_url = "https://api.thingspeak.com/channels/1936930/feeds.json?api_key=PKYCLS8M7YCBSM33&timezone=Asia%2FKolkata&results=8000&average=daily";
  async function Avg_flow_rate(){
    const response = await fetch(api_url);
    const data1 = await response.json();
    var n = data1["feeds"].length;
    var a = data1["feeds"][n-1]["field1"]; // curr day
    var b = data1["feeds"][n-2]["field1"]; // curr day
    // console.log(a,b); 
    document.getElementById("Avg_daily_flow").innerText=a.substring(0,6);
    a=parseFloat(a);
    b=parseFloat(b);
    var per = b-a;
    per = per / b;
    var perb= per.toString();
    // document.getElementById("per_higher").innerText=a.substring(0,5);
    console.log(typeof(per));
    if(perb>=0)
    document.getElementById("per_higher").innerText=perb.substring(0,5)+" % increase";
    else
    document.getElementById("per_higher").innerText=perb.substring(0,5)+" % decreased";
  }
  Avg_flow_rate(); 
}

AvgFlow();


// Curr daily flow 
function CurrFlow() {
  const api_url = "https://api.thingspeak.com/channels/1936930/feeds.json?api_key=PKYCLS8M7YCBSM33";
  async function curr_flow_rate(){
    const response = await fetch(api_url+"&results=1");
    const data1 = await response.json();
    var n = data1["feeds"].length ; 
    var a = data1["feeds"][0]["field1"];
    document.getElementById("curr_flow").innerText=a.substring(0,5);
  }
  const myInterval = setInterval(curr_flow_rate, 200); // 150 seconds 
}

CurrFlow();

// Total volume
function Total_volume() {
  const api_url = "https://api.thingspeak.com/channels/1936930/feeds.json?api_key=PKYCLS8M7YCBSM33";
  async function total_volume(){
    const response = await fetch(api_url+"&results=1");
    const data1 = await response.json();
    var n = data1["feeds"].length ; 
    var a = data1["feeds"][0]["field2"];
    document.getElementById("total_volume").innerText=a.substring(0,5)+" L";
  }
  total_volume(200);
  const myInterval = setInterval(total_volume, 1500); // 150 seconds 
}

Total_volume();

// Total bill
function Total_bill() {
  const api_url = "https://api.thingspeak.com/channels/1936930/feeds.json?api_key=PKYCLS8M7YCBSM33";
  async function total_bill(){
    const response = await fetch(api_url+"&results=1");
    const data1 = await response.json();
    // var n = data1["feeds"].length ; 
    var a = data1["feeds"][0]["field2"];
    a=parseFloat(a);
    a=a*0.0125;
    var b= a.toString();
    document.getElementById("water_bill").innerText=b.substring(0,5) + "/-";
  }
  total_bill() // 150 seconds 
}

Total_bill();

//vol in last 24 hour
function Last_hour() {
const api_url = "https://api.thingspeak.com/channels/1936930/feeds.json?api_key=PKYCLS8M7YCBSM33&timezone=Asia%2FKolkata";
async function last_hour(){
  const response = await fetch(api_url);
  const data1 = await response.json();
  var n = data1["feeds"].length;
  var a = data1["feeds"][n-1]["field2"]; // curr day
  var a1=  data1["feeds"][n-1]["created_at"];
  var date= a1.substring(0,10);
  new_api = api_url + "&end="+date;
  const response1 = await fetch(new_api);
  const data2 = await response1.json();
  var n2 = data2["feeds"].length;
  
  var b = data2["feeds"][n2-1]["field2"]; // prev day
  // console.log(b);
  a=parseFloat(a);
  b=parseFloat(b);
  var per = (a-b);
  per = per.toString();
  document.getElementById("last_hour").innerText=per.substring(0,5)+" L";
}
const myInterval = setInterval(last_hour, 150000); // 150 seconds
last_hour(); 
}

Last_hour();

function ALERT_BOX(){
const api_url = "https://api.thingspeak.com/channels/1936930/feeds.json?api_key=PKYCLS8M7YCBSM33";
async function alert_box(){
  const response = await fetch(api_url);
  const data1 = await response.json();
  var n = data1["feeds"].length;
  var a = data1["feeds"][n-1]["field1"]; // curr day
  console.log(a);
  a=parseFloat(a);
  console.log(a);
  var per = a;
  if(per>30){
    var element = document.getElementById("alert_box");
    element.style.backgroundColor = "#FF0000";
  }
  else{
    var element = document.getElementById("alert_box");
    element.style.backgroundColor = "#0000FF";
  }
}
alert_box();
}
ALERT_BOX();