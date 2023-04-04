const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal)=>{
   //var temp = orgVal.main.temp;
   //var temp = Math.round(orgVal.main.temp_max - 273.15);
   //console.log(temp);
   let temprature = tempVal.replace("{%tempVal%}",Math.round(orgVal.main.temp - 273.15));
   temprature = temprature.replace("{%tempMin%}",Math.round(orgVal.main.temp_min - 273.15));
   temprature = temprature.replace("{%tempMax%}",Math.round(orgVal.main.temp_max - 273.15));
   temprature = temprature.replace("{%location%}",orgVal.name);
   temprature = temprature.replace("{%country%}",orgVal.sys.country);
   temprature = temprature.replace("{%tempsts%}",orgVal.weather[0].main);
   return temprature;

}

const serve = http.createServer((req, res) => {
   if (req.url == "/") {
      requests(
         "https://api.openweathermap.org/data/2.5/weather?q=Bathgate,UK&APPID=b2ac5d77f5f20d64afdbc08491c94d01"
         )
         .on('data', (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata]
            //console.log(arrData[0].main.temp);
            const realTimeData = arrData
            .map((val) => replaceVal(homeFile,val))
            .join("");

            res.write(realTimeData);
         })
         .on('end', (err) => {
            if (err) return console.log("connection closed due to errors", err);
            res.end();
         })
   }
});

serve.listen(8000, "127.0.0.1");