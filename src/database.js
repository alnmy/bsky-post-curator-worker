export class Database {
    constructor(env) {
        this.sql = env.DB;
    };

    async addPost(author, rkey, time_us) {
        const query = `
            INSERT INTO Posts (author, rkey, time_us, likes, last_updated)
            VALUES (?1, ?2, ?3, ?4, ?5)
        `;
        try {
            await this.sql
                .prepare(query)
                .bind(author, rkey, time_us, 0, 0)
                .run();
            return true;
        } catch(err) {
            console.error(err);
            return false;
        }
    };

    async updatePosts(author, rkey, time_us, likes) {
        const last_updated = (Date.now()*1000)-time_us;
        const query = `
            
        `;
    }
};