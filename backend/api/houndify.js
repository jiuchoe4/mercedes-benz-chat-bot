const express = require("express");
const router = express.Router();
const JSONbig = require('json-bigint');
const axios = require('axios')
const generateAuthHeaders = require('../validation/headers')

const config = require("../config/client")

router.post("/houndify", (req, res) => {
    var headers = generateAuthHeaders(config.clientId, config.clientKey, "temp_user", "")

    //copy over hound- headers
    var houndifyHeaders = {};
    for (var key in headers) {
    var splitKey = key.toLowerCase().split('-');
    if (splitKey[0] == 'hound') {
        var houndHeader = splitKey
        .map(function(pt) {
            return pt.charAt(0).toUpperCase() + pt.slice(1);
        })
        .join('-');
        houndifyHeaders[houndHeader] = headers[key];
        }
    }

    let houndRequestInfo = houndifyHeaders['Hound-Request-Info'] || req.body;

    // Since we are sending request info in the body of post request, we don't need it in houndifyHeaders anymore.
    delete houndifyHeaders["Hound-Request-Info"];

    if (houndRequestInfo instanceof Object) {
        houndRequestInfo = JSONbig.stringify(req.body);
    }

    houndifyHeaders['Hound-Request-Info-Length'] = Buffer.byteLength(houndRequestInfo, "utf8");

    axios({
        url: 'https://api.houndify.com/v1/text' + '?query=' + encodeURIComponent(req.body.query),
        method: "post",
        headers: houndifyHeaders,
        data: houndRequestInfo
      })
        .then(function(response) {
            console.log(response.data);
            res.status(response.status).send(response.data);
        })
        .catch(function(error) {
          if (error.response) {
            res.status(error.response.status).send(error.response.data);
          } else {
            res.status(500).send(error.toString());
          }
    });
})

module.exports = router;