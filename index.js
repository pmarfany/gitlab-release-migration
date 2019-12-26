require('isomorphic-fetch');
require('./utils/console-polyfill');
const {asyncForEach} = require('./utils/async-foreach');

// User configuration
const EXPORT = require('./tag-export.json');
const TOKEN = 'access-token-from-gitlab';

// Project/server configuration
const SERVER = 'http://localhost';
const PROJECT_PATH = 'folder/project-path';

const updateTag = (tagName, description) =>
    fetch(`${SERVER}/api/v4/projects/${encodeURIComponent(PROJECT_PATH)}/repository/tags/${tagName}/release`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Private-Token': TOKEN,
        },
        body: JSON.stringify({ description }),
    }).then((res) => {
        if ( res.ok ) { return res.json(); }
        throw new Error(res.status);
    });

const getFailureReason = (tagName, status) => {
    switch (status) {
        case '400': return `Tag ${tagName} request is bad`;
        case '401': return `You are not authorized to update tag ${tagName}`;
        case '404': return `Tag ${tagName} does not exist`;
        case '409': return `Tag ${tagName} already contains info`;
        default: return `Cannot update tag ${tagName}`;
    }
}

asyncForEach(EXPORT, async (value) => {
    if ( typeof value.release === 'undefined' || value.release === null ) { return; }

    try {
        await updateTag(value.name, value.release.description);
        console.success('Updated tag', value.name, 'success!');
    } catch (e) {
        console.error(getFailureReason(value.name, e.message));
    }
});
