// For dev and testing
export const _fetchJSON = (payload, strength=1, autoflip=1.0) => {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve.bind(this, require("./mockData.json")), 1500)
    });
};

// For production
export const fetchJSON = (payload, strength = 1, autoflip = 1.0) => {
    const request_header = {
        method: "POST",
        headers: {
            "x-rapidapi-host": "quillbot.p.rapidapi.com",
            "x-rapidapi-key": "4e26127674msh44f405456fbb569p15cdd2jsn41c7e4a8bdd5",
            "content-type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            text: payload,
            numParaphrases: 1,
            includeSegs: true,
            strength: strength,
            autoflip: autoflip,
        }),
    }
    return fetch("https://quillbot.p.rapidapi.com/paraphrase", request_header)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .catch((err) => {
            console.warn(err);
            return null;
        });
};