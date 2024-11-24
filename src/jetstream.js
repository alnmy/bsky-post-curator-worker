export class JetStreamClient {
    constructor(url = 'wss://jetstream1.us-west.bsky.network/subscribe') {
        this.queue = [];
        this.ws = new WebSocket(`${url}`);

        this.ws.addEventListener('error', error => {
            console.error('WebSocket error:', error);
        });

        this.ws.addEventListener('message', event => {
            try {
                const json = JSON.parse(event.data);
                this.queue.push(json);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });
    }

    async get() {
        while (this.queue.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        // todo: proper async
        return this.parse(this.queue.shift());
    }

    async getMetadata(data) { 
        const kind = data.kind;
        const isRetraction = (data[kind].operation === 'delete'); 
        const collection = data[kind].collection;
        return {
            kind: kind,
            isRetraction: isRetraction,
            collection: collection,
            did_author: data.did,
            time_us: data.time_us,
        }
    };

    async parseLike(data, metadata) {
        if (metadata.isRetraction) return {
            type: "delete:like",
            author: metadata.did_author,
            rkey: data.commit.rkey,
            time_us: metadata.time_us,
        };

        const likedPost = data.commit.record.subject.uri;
        const likedPostAuthor = /did:plc:\w*/gm.exec(likedPost);
        const likedPostID = /(?<=post\/)\w*/gm.exec(likedPost);

        return {
            type: "create:like",
            author: metadata.did_author,
            rkey: data.commit.rkey,
            time_us: metadata.time_us,
            post: {
                author: likedPostAuthor[0],
                id: likedPostID[0],
            },
        };
    };

    async parsePost(data, metadata) {
        return {
            type: (metadata.isRetraction) ? "create:post" : "delete:post",
            author: metadata.did_author,
            rkey: data.commit.rkey,
            time_us: metadata.time_us,
        };
    };

    async parse(data) {
        const metadata = await this.getMetadata(data);
        switch (metadata.collection) {
            default:
                return data;
            case "app.bsky.feed.like":
                return await this.parseLike(data, metadata);
            case "app.bsky.feed.post":
                return await this.parsePost(data, metadata);
        }
    }
}