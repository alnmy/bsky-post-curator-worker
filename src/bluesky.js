const publicApi = "https://public.api.bsky.app";

function getPostUri(did, rkey) {
    return `at://${did}/app.bsky.feed.post/${rkey}`;
}

async function getPost(did, rkey) {
    const endpoint = `${publicApi}/xrpc/app.bsky.feed.getPostThread`;
    const atUri = getPostUri(did, rkey);
    const query = `${endpoint}?uri=${atUri}&depth=1`
    try {
        const res = await fetch(query);
        if (res.status === 200) {
            try {
                const response = await res.json();
            } catch (error) {
                // Handle JSON parse error
                return null;
            }
        } else if (res.status === 400) {
            return false;
        } else {
            return null;
        }
    } catch (error) {
        // Handle fetch error
        return false;
    }
}

