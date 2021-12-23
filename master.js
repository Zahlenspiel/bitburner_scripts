/** @param {NS} ns **/
export async function main(ns) {
    const host = ns.getHostname();
    //var moneyThresh = ns.getServerMaxMoney(target) * 0.75; // % 
    //var securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    // get servers.txt list
    const targets = await JSON.parse(ns.read("servers.txt"));

	// ns.tprint(servers); // array
	ns.tprint("Targets: " + targets.length);

    // deploy
    for (const target of targets) {
        // check if target is hackable
        var hackingSkill = ns.getHackingLevel();
        var hackingLevel = ns.getServerRequiredHackingLevel(target);
        if ( hackingSkill < hackingLevel) {
            ns.print("Hacking skill is " + hackingSkill + ", " + hackingLevel + "required.");
            ns.print("Skipping " + target);
            continue;
        }

        // check if app exists on host and executes it on target
        if (ns.fileExists("BruteSSH.exe", host)) {
            ns.brutessh(target);
            ns.print("Executed BruteSSH.exe on " + target);
        }
        if (ns.fileExists("FTPCrack.exe", host)) {
            ns.ftpcrack(target);
            ns.print("Executed FTPCrack.exe on " + target);       
        }
        if (ns.fileExists("relaySMTP.exe", host)) {
            ns.relaysmtp(target);
            ns.print("Executed relaySMTP.exe on " + target);       
        }

        // check if nuke works
        var reqPorts = ns.getServerNumPortsRequired(target);
        if (reqPorts <= 3) {
            ns.nuke(target);
            ns.print("Sucessfully nuked " + target);
        } else {
            ns.print("Can't nuke " + target + ", " + reqPorts + " open ports required.");
            ns.print("Skipping " + target);
            continue;
        }

        // deploy hack
        if (!ns.scriptRunning('hack.ns', target)) {
                
            // upload hack
            ns.tprint("Uploading hack.ns to " + target);
            try {
                await ns.scp("hack.ns", target);
            } catch (err) {
                ns.tprint(err);
            } finally {
                ns.tprint("Hack transfered successfully!");
            }
                
            // exec hack
            ns.tprint("Executing hack.ns at " + target);
            try {
                ns.exec("hack.ns", target, 1);
            } catch (err) {
                ns.tprint(err);
            } finally {
                ns.tprint("Hack started!");
            }
                
            ns.tprint("Done with target " + target);
        } else {
            ns.tprint("Hack is already running on server " + target);
            ns.print("Skipping " + target);
            continue;
        }
    } 
}