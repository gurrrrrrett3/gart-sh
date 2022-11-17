// type: gsh command

import gshConsole from "../../modules/console";
import ShortLinkManager from "../../modules/links";

const lstats = {
  name: "lstats",
  desc: "Get stats about a short link",
  args: [
    {
      name: "id",
      desc: "The link ID to get stats for",
      type: "string",
      required: true,
    },
  ],
  run: async (self: gshConsole, args: string[]) => {
    let id = args[0];
    if (!id) {
      return "id: missing operand";
    }

    if (id.startsWith("https://gart.sh/")) {
      id = id.replace("https://gart.sh/", "");
    }

    const stats = await ShortLinkManager.getStats(id);

    if (!stats) {
      return "Link not found";
    }

    const options = stats.options ? JSON.parse(stats.options) : undefined;

    let ipTable: string[] = [];

    if (options && options.grab) {
      const ips = await ShortLinkManager.getIps(id);
      if (!ips) return;
      ips.forEach((ip) => {
        ipTable.push(`<tr><td>${ip.ip}</td><td>${ip.clicked}</td></tr>`);
      });
    }

    return [
      `<span class="cyan">Stats for <a href="https://gart.sh/${id}">https://gart.sh/${id}</a></span>`,
      `<span class="green">Links to:</span> <a href="${stats.url}">${stats.url}</a> | <button onclick="navigator.clipboard.writeText('${stats.url}')" >Copy</button>`,
      `<span class="green">Created:</span> ${new Date(stats.createdAt).toLocaleString()}`,
      `<span class="green">Last used:</span> ${new Date(stats.lastUsedAt).toLocaleString()}`,
      `<span class="green">Uses:</span> ${stats.uses}`,
      `<span class="green">ID:</span> ${stats.id}`,
      options && options.grab ? `<span class="green">Clicked IPs:</span> <table><tr><th>IP</th><th>Clicks</th></tr>${ipTable.join("")}</table>` : "",
    ];
  },
};

export default lstats;
