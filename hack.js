/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.getHostname();
    var moneyThresh = ns.getServerMaxMoney(target) * 0.75; // % 
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
     
    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target); // weaken if secLevel is higher than threshold
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target); // grow if money is lower than threshold
        } else {
            await ns.hack(target); // hack target
        }
    }
}