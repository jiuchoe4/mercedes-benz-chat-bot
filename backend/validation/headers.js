const uuid = require('node-uuid');
const crypto = require('crypto');

module.exports = function generateAuthHeaders (clientId, clientKey, userId, requestId) {
    // Generate a unique UserId and RequestId.
    userId = userId || uuid.v1();

    requestId = requestId || uuid.v1();

    var requestData = userId + ';' + requestId;

    var timestamp = Math.floor(Date.now() / 1000),  

        unescapeBase64Url = function (key) {
            return key.replace(/-/g, '+').replace(/_/g, '/');
        },

        escapeBase64Url = function (key) {
            return key.replace(/\+/g, '-').replace(/\//g, '_');
        },

        signKey = function (clientKey, message) {
            var key = new Buffer(unescapeBase64Url(clientKey), 'base64');
            var hash = crypto.createHmac('sha256', key).update(message).digest('base64');
            return escapeBase64Url(hash);

        },

        encodedData = signKey(clientKey, requestData + timestamp),
        headers = {
            'Hound-Request-Authentication': requestData,
            'Hound-Client-Authentication': clientId + ';' + timestamp + ';' + encodedData
        };

    return headers;
};