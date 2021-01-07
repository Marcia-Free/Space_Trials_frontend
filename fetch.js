export const generalFetch = (url, options = {}) => {
    return fetch(url, options).then((res) => res.json());
};

export const makeOptions = (method, body = {}) => {
    return {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };
};
