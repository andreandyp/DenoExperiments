// Dependencies
import { Oak, Dejs } from "./deps.ts";
const { Application, Router } = Oak;
const { renderFile } = Dejs;
const { copy, Buffer } = Deno;

const app = new Application();
const router = new Router();

// A CRUD of Dua Lipa's songs
const duaLipaSongs = [{
  name: "Don't start now",
  yearOfRelease: 2019,
}, {
  name: "One kiss",
  yearOfRelease: 2017,
}];

router.get("/index", async (context: any) => {
  // We can use the template engine as always
  const output = await renderFile(`${Deno.cwd()}/template.ejs`, {
    songsList: duaLipaSongs,
  });

  // The file needs to be copied to a buffer
  const buf = new Buffer();
  await copy(output, buf);

  // It can be sent via context.response.body
  context.response.body = new TextDecoder().decode(buf.bytes());
});

router.post("/song", async (context: any) => {
  // Currently, only JSON-encoded body can be read
  const body = await context.request.body();
  duaLipaSongs.push(body.value);

  // There isn't method to redirect a client yet
  context.response.body = "/index";
});

app.use(router.routes());

const PORT = 8080;
// And no way to add an event listener, so maybe this log is not 100% accurate
console.log(`Listening on ${PORT}`);
await app.listen({ port: PORT });
