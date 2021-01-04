export { generalFetch, makeOptions };

function generalFetch(url, options = {}) {
    return fetch(url, options).then((res) => res.json());
}

function makeOptions(method, body = {}) {
    return {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };
}
