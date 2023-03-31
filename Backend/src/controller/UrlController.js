const urlModel = require("../model/UrlModel");
const shortid = require("shortid");
const redis = require("redis");
const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
  15069,
  "redis-15069.c232.us-east-1-2.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);

// Redis Authorization
redisClient.auth("unGERzRfl8fzL1XjV8HoiovBT4u0MfwG", function (err) {
  if (err) throw err;
});

//Connect to redisDataBase
redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

// Set And Get Dada in Redis Database
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


//========================== Post Api  , Create Short Url ======================
const urlCreation = async function (req, res) {
  try {
    data = req.body;
    console.log("req Body" , req.body)
    let longUrl = data.longUrl;

    //  Validation of Request Body Data
    if (Object.keys(data).length === 0)
      return res
        .status(400)
        .json( "data is required" );

    if (!longUrl)
      return res
        .status(400)
        .json( "please enter longUrl");

    if (typeof longUrl !== "string")
      return res
        .status(400)
        .json( "url should be in string format")

    //==== Regex use Valid Url =====
    let reg =
      /^(https:\/\/www\.|http:\/\/www\.|www\.|https:\/\/|http:\/\/)[^www.,-_][a-zA-Z0-9\-_.$]+\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)$/gm;

    let regex = reg.test(longUrl);
    if (regex === false) {
      return res
        .status(400)
        .json(  "Please Enter a valid URL." );
    }

    // ======== Already Shorten Url In DataBase ===================
    const urlExist = await urlModel
      .findOne({ longUrl: longUrl })
      .select({ _id: 0, longUrl: 1, urlCode: 1, shortUrl: 1 });
    if (urlExist)
      return res.status(201).json(
       urlExist,
      );

    //  Generate Short Url By ShortId
    const urlCode = shortid.generate().toLowerCase();

    const baseUrl = "http://localhost:8080";

    const obj = {
      longUrl: longUrl,
      shortUrl: baseUrl + "/" + urlCode,
      urlCode: urlCode,
    };
    // DB call
    const createUrl = await urlModel.create(obj);
    return res
      .status(201)
      .json (createUrl );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json( error.message);
  }
};



//======================== Get Api  , Fetch Short Url =====================

const getUrl = async function (req, res) {
  try {
    let urlCode = req.params.urlCode;

    // Regex validation UrlCode
    if (/.*[A-Z].*/.test(urlCode)) {
      return res.status(400).json(
         "please Enter urlCode only in lowerase",
      );
    }

    // Already UrlCode Exist in DB
    const urlCodeExist = await urlModel.findOne({ urlCode: urlCode });
    if (!urlCodeExist)
      return res
        .status(404)
        .json( "urlCode not found" );

    // GetData  from Redis

    let cacheData = await GET_ASYNC(`${req.params.urlCode}`);
    cacheData = JSON.parse(cacheData);
    if (cacheData) {
      res.status(302).redirect(cacheData.longUrl);
    } else {
      let orignalUrl = await urlModel
        .findOne({ urlCode: urlCode })
        .select({ _id: 0, longUrl: 1 });
      await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(orignalUrl));
      return res.status(302).redirect(orignalUrl.longUrl);
    }
  } catch (err) {
    return res
      .status(500)
      .json(   err.message );
  }
};

module.exports = { urlCreation, getUrl };
