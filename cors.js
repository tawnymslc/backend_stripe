const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:4243', 'https://tawny-mathi.com', 'https://portfolio-website-nine-opal.vercel.app/payment', 'https://portfolio-website-nine-opal.vercel.app'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);