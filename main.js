const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://tinder.com";

app.use(cors());
app.use(morgan('dev'));

app.use('/', proxy(API_SERVICE_URL, {
   userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
      let body = proxyResData.toString('utf8');
      body = body.replace(/https:\/\/[^.]+\.gotinder.com/g, (match) => {
         return match.replace('https://', 'https://').replace('gotinder.com', 'foreignpoint.ru');
       });
       
       const regex = /const\s*t\s*=\s*\{\s*lat:\s*e\.coords\.latitude,\s*lon:\s*e\.coords\.longitude,\s*timestamp:\s*Date\.now\(\)\s*\}/gm
       const newCode = `
                           const t = {
                               lat: 52.3833,
                               lon: 4.9000,
                               timestamp: Date.now()
                           }
       `;
       const replacedData = body.replace(regex, newCode);
           
       return replacedData;
   }
}));

app.listen(PORT, HOST, () => {
   console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
