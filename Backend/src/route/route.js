const express = require("express")
const router = express.Router()
const { urlCreation, getUrl } = require("../controller/UrlController");


//  Router || Post
router.post("/url/shorten", urlCreation);

//  Router || Get
router.get("/:urlCode", getUrl);



// Check Request Valid or Invalid
router.all("/*",function(req,res){
    return res.status(400).send({status:false,message:"path not found"})
})


module.exports = router;