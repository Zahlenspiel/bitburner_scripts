/** @param {NS} ns **/
export async function main(ns) {
    const host = ns.getHostname();
    const servers = [host];
      for (const server of servers) {
          for (const hostname of ns.scan(server)) {
              if (!servers.includes(hostname)) {
                  servers.push(hostname);
              }
          }
      }
        
    await ns.write("servers.txt", JSON.stringify(servers), "w");
    ns.tprint("servers.txt created!");
  }