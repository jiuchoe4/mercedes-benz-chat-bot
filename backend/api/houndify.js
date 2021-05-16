const express = require("express");
const router = express.Router();
const JSONbig = require('json-bigint');
const axios = require('axios')
const generateAuthHeaders = require('../validation/headers')

const config = require("../config/client")

const BASE_URL = "https://api.mercedes-benz.com/experimental/connectedvehicle_tryout/v2/vehicles"
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

    // get WrittenResponse from Houndify Server
    axios({
        url: 'https://api.houndify.com/v1/text' + '?query=' + encodeURIComponent(req.body.query),
        method: "post",
        headers: houndifyHeaders,
        data: houndRequestInfo
      })
        .then(response => {
            // Send request to Mercedes-Benz API. Command is retrieved from the Houndify response
            const apiAddress =  response.data.AllResults[0].Result.apiAddress
            // temp vehicleId
            const vehicleId = "1234567890ABCD1234"

            // Check if command has intent/is a POST request
            if("Intent" in response.data.AllResults[0].Result)
            {
                // Grab xxx value from CAR.xxx
                const intent = response.data.AllResults[0].Result.Intent
                const afterDot = intent.substr(intent.indexOf('.') + 1).toUpperCase()
                const command = {
                    "command": afterDot
                }
                axios({
                    url: BASE_URL + `/${vehicleId}` + `/${apiAddress}` + '?Authorization=Bearer' + config.bearerToken,
                    method: "post",
                    data: command
                })
                    .then(response1 => {
                        // Return Written Response to user
                        res.status(response.status).send(response.data.AllResults[0].WrittenResponse);
                    })
                    .catch(error => {
                        if (error.response) {
                          res.status(error.response.status).send(error.response.data);
                        } else {
                          res.status(500).send(error.toString());
                        }
                    });
            }
            else
            {
                axios({
                    url: BASE_URL + `/${vehicleId}` + `/${apiAddress}` + '?Authorization=Bearer' + config.bearerToken,
                    method: "get"
                })
                    .then(response1 => {
                        // Return Written Response to user
                        const newResponse = {
                            "WrittenResponse": response.data.AllResults[0].WrittenResponse,
                            "data": response1.data
                        }
                        res.status(response.status).send(newResponse)
                    })
                    .catch(error => {
                        const newResponse = {
                            "WrittenResponse": response.data.AllResults[0].WrittenResponse,
                            "data": "randomdata"
                        }
                        res.status(response.status).send(newResponse)
                        // if (error.response) {
                        // res.status(error.response.status).send(error.response.data);
                        // } else {
                        // res.status(500).send(error.toString());
                        // }
                    });
            }
        })
        .catch(error => {
          if (error.response) {
            res.status(error.response.status).send(error.response.data);
          } else {
            res.status(500).send(error.toString());
          }
    });
})

module.exports = router;