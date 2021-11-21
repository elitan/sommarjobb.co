import { NhostClient } from "@nhost/nhost-js";
import fs from "fs";
import slugify from "slugify";

const nhost = new NhostClient({
  backendUrl: "https://kqgngjmtygqovuixntdc.nhost.run",
});

fs.readFile("locations.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);

  data = JSON.parse(data);

  data.forEach((region) => {
    console.log({ region });
    console.log(region.name);
    console.log(slugify(region.name, { lower: true }));
  });
});
