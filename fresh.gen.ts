// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $about from "./routes/about.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $api_random_uuid from "./routes/api/random-uuid.tsx";
import * as $countdown from "./routes/countdown.tsx";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $Countdown from "./islands/Countdown.tsx";
import * as $Counter from "./islands/Counter.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/about.tsx": $about,
    "./routes/api/joke.ts": $api_joke,
    "./routes/api/random-uuid.tsx": $api_random_uuid,
    "./routes/countdown.tsx": $countdown,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/Countdown.tsx": $Countdown,
    "./islands/Counter.tsx": $Counter,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
