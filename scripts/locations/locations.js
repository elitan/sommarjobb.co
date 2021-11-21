import { NhostClient } from "@nhost/nhost-js";
import fs from "fs";

const nhost = new NhostClient({
  backendUrl: "https://kqgngjmtygqovuixntdc.nhost.run",
});

const INSERT_REGION = `
mutation insertRegions($regions: [regions_insert_input!]!) {
  insertRegions(objects:$regions) {
    affected_rows
  }
}
`;

function slugify(s) {
  return s.replace(" ", "-").toLowerCase();
}

let mun = new Set();

let regions = [];

fs.readFile("locations.json", "utf8", async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);

  data = JSON.parse(data);

  data.forEach((region) => {
    console.log({ region });
    console.log(JSON.stringify(region, null, 2));
    console.log(region.name);
    console.log(slugify(region.name, { lower: true }));

    const municipalities = {
      data: [],
    };

    region.items.forEach((item) => {
      const nameSlug = slugify(item.name);

      if (mun.has(nameSlug)) {
        console.log("already there!");
        console.log(item);
        console.log(nameSlug);
        process.exit(1);
      }

      mun.add(nameSlug);

      municipalities.data.push({
        slug: slugify(item.name),
        name: item.name,
        arbetsformedlingenId: item.id,
      });
    });

    regions.push({
      slug: slugify(region.name),
      name: region.name,
      arbetsformedlingenId: region.id,
      municipalities,
    });
  });

  console.log(JSON.stringify(regions, null, 2));

  let { data: gqlData, error } = await nhost.graphql.request(
    INSERT_REGION,
    { regions },
    {
      headers: {
        "x-hasura-admin-secret": "481bdb347655346a426e1a1dc9c805e1",
      },
    }
  );

  console.log({ error });
  console.log({ gqlData });
});
