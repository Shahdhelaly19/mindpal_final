import loggly from "node-loggly-bulk";

const client = loggly.createClient({
  token: "3d090bb1-9eeb-4c1b-ba32-085a0c1e5197",
  subdomain: "shahdhelaly22",
  tags: ["MindPal", "NodeJS"],
  json: true
});

export const log = (message) => {
  client.log(message);
};
