import { JetStreamClient } from "./jetstream";

export default {
	async fetch(request, env, ctx) {
		const js = new JetStreamClient();
		return new Response(JSON.stringify(await js.get()));
	},
};
