import RefreshingBoatMap from "../islands/RefreshingBoatMap.tsx";

import { Handlers, PageProps } from "$fresh/server.ts";
import Legends from "../islands/Legends.tsx";

export const handler: Handlers = {
  GET(req, ctx) {
    // Get origin from request
    const url = new URL(req.url);
    const origin = url.origin;

    // Pass it to the page component
    return ctx.render({ origin });
  },
};

export default function Home({ data }: PageProps<{ origin: string }>) {
  return (
    <div>
      <RefreshingBoatMap apiUrl={data.origin} />
      <Legends />

    </div>
  );
}
