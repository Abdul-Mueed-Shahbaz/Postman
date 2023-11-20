const baseUrl = pm.variables.get('base_url');
const accessToken = pm.variables.get('access_token');
const refreshToken = pm.variables.get('refresh_token');

const verifyTokenEndpoint = baseUrl + "auth/verify"
const refreshTokenEndpoint = baseUrl + "auth/token/refresh"
const loginEndpoint = baseUrl + "auth/login";


if (!accessToken || !refreshToken) {
    getTokens()
    return
}

verifyAccessToken(accessToken, refreshToken)

function verifyAccessToken(accessToken, refreshToken) {
    console.log("***VERIFYING ACCESS TOKEN***")
    pm.sendRequest({
        url: verifyTokenEndpoint,
        method: 'POST',
        header: { "Content-Type": "application/json" },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "token": accessToken,
            })
        }
    }, function(err, response) {
        if (response.code !== 200) {
            verifyRefreshAndGetToken(refreshToken)
        }
    });
}

function setFreshAccessToken(refreshToken) {
    console.log("***SETTING FRESH ACCESS TOKEN***")
    pm.sendRequest({
        url: refreshTokenEndpoint,
        method: 'POST',
        header: { "Content-Type": "application/json" },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "refresh": refreshToken,
            })
        }
    }, function(err, response) {
        console.log(response.json())
        if (response.code === 200) {
            pm.collectionVariables.set('access_token', response.json().access);
        }
    });
}

function verifyRefreshAndGetToken(refreshToken) {
    console.log("***VERIFYING REFRESH TOKEN***")
    pm.sendRequest({
        url: verifyTokenEndpoint,
        method: 'POST',
        header: { "Content-Type": "application/json" },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "token": refreshToken,
            })
        }
    }, function(err, response) {
        if (response.code !== 200) {
            getTokens()
            return
        }
        setFreshAccessToken(refreshToken)
    });
}



function getTokens() {
    console.log("***FETCHING FRESH ACCESS AND REFRESH TOKENS***")
    pm.sendRequest({
        url: loginEndpoint,
        method: 'POST',
        header: { "Content-Type": "application/json" },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "username": "reddead3",
                "password": "abc12345"
            })
        }
    }, function(err, response) {
        if (!err) {
            pm.collectionVariables.set('access_token', response.json().access);
            pm.collectionVariables.set('refresh_token', response.json().refresh);
        }
    });
}