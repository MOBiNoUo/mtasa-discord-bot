const getMtasa = require("@bsnext/mta-ase-query");
async function getBy(ip, port = 22003) {
    const serverInfo = await getMtasa.getServerInfo(ip, port);
    return serverInfo;
}

module.exports = { getBy };
