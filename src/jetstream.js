export class JetStreamClient {
    constructor(url = 'wss://jetstream1.us-west.bsky.network/subscribe') {
        this.queue = [];
        this.ws = new WebSocket(url);

        this.ws.addEventListener('error', error => {
            console.error('WebSocket error:', error);
        });

        this.ws.addEventListener('message', event => {
            try {
                const data = this.parse(JSON.parse(event.data));
                if (data !== undefined) this.queue.push(JSON.stringify(data));
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });
    }

    async get() {
        while (this.queue.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.queue.shift();
    }

    parse(data) {
        try {
            const isPost = (data.commit.collection === 'app.bsky.feed.post');
            if (isPost) {
                return {
                    type: (data[data.kind].operation === 'delete') ? "delete:post" : "create:post",
                    author: data.did,
                    rkey: data.commit.rkey,
                    time_us: data.time_us,
                }
            } else {
                return undefined
            };
        } catch (error) {
            return undefined;
        };
    }
}