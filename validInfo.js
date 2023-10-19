export default function(req, res, next) {
    const { nameS, password } = req.body;

    function validUs(nameS) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(nameS);
    }

    if (req.path === "/register") {
        console.log(!nameS.length);
        if (![nameS, password].every(Boolean)) {
        return res.json("Missing Credentials");
        }
    } else if (req.path === "/login") {
        if (![nameS, password].every(Boolean)) {
        return res.json("Missing Credentials");
        }
    }

    next();
};