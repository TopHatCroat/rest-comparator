
global.toB64 = str => {
    return Buffer.from(str).toString('base64');
};

global.fromB64 = str => {
    return Buffer.from(str, 'base64').toString()
};
