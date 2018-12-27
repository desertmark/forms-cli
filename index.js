const axios = require('axios');
const config = {
    baseUrl:'',
    token:''
};

async function init() {
    try {
        const forms = await getFroms({ params: { limit: 2 } });
        console.log(forms.length);

        const formCount = await getFormsCount();
        console.log(formCount);
        process.exit(0);
    } catch (e) {
        console.error('An unexpected error occurred', e);
        process.exit(1);
    }
}

/**
 * Gets the form list from FormioApi
 * @return {Array} options 
 */
function getFroms(options) {
    options = {
        ...options,
        url: `${config.baseUrl}/form`,
        method: 'GET',
        headers: {
            'x-token': config.token
        }
    }
    return axios(options)
        .then(res => res.data)
        .catch(handleError('Error while trying to get form list.'));
}

function getFormsCount() {
    const query = [
        {
            "$match": {
                "form": {
                    "$count": 'count'
                }
            }
        }
    ]
    return report(query)
}

function report(query, options) {
    options = {
        ...options,
        url: `${config.baseUrl}/report`,
        method: 'POST',
        headers: {
            'x-token': config.token
        },
        data: query
    };
    return axios(options)
        .then(res => res.data)
        .catch(handleError('Error while trying to get a forms report.'));
}

function handleError(msg) {
    return error => {
        console.error(msg, error && error.response ? error.response.data : error);
        throw error;
    }
}

init();
