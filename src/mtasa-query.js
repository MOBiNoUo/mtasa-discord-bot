const axios = require('axios');

async function getBy(ip, port = 22126) {
    const res = await axios.get(`http://ir.ouomen.ir/api/mtasa/?ip=${ip}&asePort=${port}`);
    return res.data;
}

module.exports = { getBy };
