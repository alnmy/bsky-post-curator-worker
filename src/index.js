import { JetStreamClient } from "./jetstream";

export default {
	async fetch(request, env, ctx) {
		const { pathname } = new URL(request.url);

		if (pathname === "/") {
			return new Response("Hello, world!");
		}

		const js = new JetStreamClient();
		let n = 0;
		while 
		js.ws.close();
		return new Response(JSON.stringify(posts));
	},

	async scheduled(event, env, ctx) {
		const js = new JetStreamClient();
	};
};
