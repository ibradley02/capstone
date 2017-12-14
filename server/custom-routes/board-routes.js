let Users = require('../models/user')
let request = require('request')
let YUI = require('yui').use('yql', 'dataschema', 'datatype')
let Feedly = require('feedly')

var f = new Feedly({
    client_id: 'd4600ded-885d-4173-b9ed-8f41592b1d6e',
    client_secret: 'A3H3PsHe7hDKWyzRZJb2ycIV4FwIhzE0FbEMrBKIkNvIt8Ofoqy_u0zI95xDuzRuQd2niCZboEdwN89QH2DvSJrJmum9UoWLATkDzDdZa4VfgRjJSThRYtce_gOnGEIf6_NLEDqNogwJZuSF7OhLUYoersoJgcIF6x7CVWvHms5QSJeP5eNKsXxfzlB1HGL1Ozefm9tVrA_zzlDp7vtRtvDCBRln5lg:feedlydev',
    port: 8080
})

var options = {
    url: 'https://cloud.feedly.com/v3/profile',
    headers: {
        "Authorization": "OAuth A3H3PsHe7hDKWyzRZJb2ycIV4FwIhzE0FbEMrBKIkNvIt8Ofoqy_u0zI95xDuzRuQd2niCZboEdwN89QH2DvSJrJmum9UoWLATkDzDdZa4VfgRjJSThRYtce_gOnGEIf6_NLEDqNogwJZuSF7OhLUYoersoJgcIF6x7CVWvHms5QSJeP5eNKsXxfzlB1HGL1Ozefm9tVrA_zzlDp7vtRtvDCBRln5lg:feedlydev"
    }
}


module.exports = {
    getFeedly: {
        path: '/feedly',
        reqType: 'get',
        method(req, res, next) {
            let action = 'make request to outside api and return data requested'
            request(options, (err, response, body) => {
                if (!err && response.statusCode == 200) {
                    var info = JSON.parse(body)
                    res.send(handleResponse(action, info))
                }
            }, error => {
                res.status(401).send(handleResponse(action, null, error))
            })
        }
    },
    getWeather: {
        path: '/weather/:lat/:long',
        reqType: 'get',
        method(req, res, next) {
            let action = 'make request to outside api and return data requested'
            request('https://api.openweathermap.org/data/2.5/weather?lat=' + req.params.lat + '&lon=' + req.params.long + '&units=imperial&&appid=8d7d6f68ddb8370dd6ae5712e11ca530', function (error, response, body) {
                console.log('error:', error)
                console.log('statusCode:', response && response.statusCode)
                res.send(body)
            })
        }

    },
    getEvents: {
        path: '/event/:lat/:long',
        reqType: 'get',
        method(req, res, next) {
            let action = 'make request to outside api and return data requested'
            request('http://api.eventful.com/json/events/search?&where=' + req.params.lat + ',' + req.params.long + '&within=25&app_key=j8PNS6tcSztxdnWS', function (error, response, body) {
                console.log('error:', error)
                console.log('statusCode:', response && response.statusCode)
                res.send(body)
            })
        }

    },
    getQuote: {
        path: '/quote',
        reqType: 'get',
        method(req, res, next) {
            let action = 'make request to outside api and return data requested'
            request('http://quotesondesign.com/api/3.0/api-3.0.json', function (error, response, body) {
                console.log('error:', error)
                console.log('statusCode:', response && response.statusCode)
                res.send(body)
            })
        }
    },
    getGoogleUser: {
        path: '/google/:token',
        reqType: 'get',
        method(req, res, next) {
            let action = 'make request to outside api and return data requested'
            //aud: the client ID of the web component of the project
            //azp: the client ID of the Android app component of project
            var profileUrl = "https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token="
            var calenderUrl = "https://www.googleapis.com/calendar/v3/userinfo?alt=json&access_token="
            var authCheckUrl = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token="
            var authEmailUrl = "https://www.googleapis.com/gmail/v1/users/115581082286636298877/history?access_token="
            var tokenInfoUrl = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='

                request(tokenInfoUrl + req.params.token, function (error, response, body) {
                    debugger
                    body = JSON.parse(body)
                    // console.log('statusCode:', response && response.statusCode)
                    Users.findOneAndUpdate({email: body.email}, body, {upsert: true}).then(user => {
                        console.log(user)
                        res.send(user)

                    })

                })
        }

    },
    getGoogleProfile: {
        path: '/google/:payload',
        reqType: 'get',
        method(req, res, next) {
            let action = 'make request to outside api and return data requested'
            //aud: the client ID of the web component of the project
            //azp: the client ID of the Android app component of project
                request('https://www.googleapis.com/auth/userinfo.profile/oauth2/v3/tokeninfo?access_token=' + req.params.payload, function (error, response, body) {
                    console.log(body)
                    console.log('error:', error)
                    // console.log('statusCode:', response && response.statusCode)
                    res.send(body)
                })
        }

    }
}

function handleResponse(action, data, error) {
    var response = {
        action: action,
        data: data
    }
    if (error) {
        response.error = error
    }
    return response
}

// https://www.googleapis.com/gmail/v1/users/115581082286636298877/history

// "scope": "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.circles.members.read https://www.googleapis.com/auth/plus.profile.agerange.read https://www.googleapis.com/auth/plus.profile.language.read https://www.googleapis.com/auth/plus.moments.write"

