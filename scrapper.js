//Packages

const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const url =
  'https://www.amazon.in/Apple-iPhone-13-128GB-Starlight/dp/B09G9D8KRQ/ref=sr_1_2?crid=3HX3596TSG3Q1&keywords=iphone+14&qid=1658912342&sprefix=iphone+14%2Caps%2C272&sr=8-2';

const product = { name: '', price: '', url: '' };

//Setting interval
const handle = setInterval(scrapper, 20000);

async function scrapper() {
  //fetch the data
  const { data } = await axios.get(url);
  //cherrio
  const $ = cheerio.load(data);
  const item = $('div#dp-container');
  //Extract the data
  product.name = $(item).find('h1 span#productTitle').text();
  product.url = url;
  const price = $(item)
    .find('span .a-price-whole')
    .first()
    .text()
    .replace(/[,.]/g, '');
  const priceNum = parseInt(price);
  product.price = priceNum;
  console.log(product);

  //Send SMS
  if (priceNum < 100000) {
    client.messages
      .create({
        body: `The price of${product.name} is ${price}. Buy it here ${product.url}`,
        from: '+17372326062',
        to: '++91YOURVERIFIEDTWILIOPHONE',
      })
      .then((message) => {
          console.log(message);
          clearInterval(handle);
      });
  }
}
scrapper();
