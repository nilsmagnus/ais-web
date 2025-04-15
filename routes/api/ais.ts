import { Handlers } from "$fresh/server.ts";

export const handler: Handlers ={

    async GET(_req) {
        const parsedUrl = new URL(_req.url)
        
        const maxlat = parsedUrl.searchParams.get("north");
        const maxlon = parsedUrl.searchParams.get("east");
        const minlat = parsedUrl.searchParams.get("south");
        const minlon = parsedUrl.searchParams.get("west");

        const url =`https://bytecode.no/ais/vessels/minlat/${minlat}/maxlat/${maxlat}/minlon/${minlon}/maxlon/${maxlon}`;
        const response = await fetch(url);
        const results = await response.json()
        return new Response(JSON.stringify(results), {
            headers: {"Content-Type":"application/json"}
        }) ;
    },
}