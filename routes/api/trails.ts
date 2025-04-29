import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req) {
    const parsedUrl = new URL(_req.url);

    const userId = parsedUrl.searchParams.getAll("user-id");
    let trailLength = parsedUrl.searchParams.get("tl");
    if(trailLength === null || trailLength === undefined ){
      trailLength = '2';
    } else if( +trailLength > 720){
      trailLength = '2';
    }

    if (userId.length == 0) {
      return new Response(JSON.stringify({"error":"missing or invalid param user-id"}), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }

    const url = `https://bytecode.no/ais/vessel/trails?u=${userId.join("&u=")}&hours=${trailLength}`;
    console.log(url);
    const response = await fetch(url);
    const results = await response.json();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
