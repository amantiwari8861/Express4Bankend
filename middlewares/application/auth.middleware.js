const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    console.log("authenticating....");
    const ip = req.headers['x-forwarded-for'] || // if behind proxy
        req.socket.remoteAddress;
    const port = req.socket.remotePort;
    // Get User-Agent
    const userAgent = req.headers['user-agent'];
    console.log(userAgent, " => ", ip, ":", port);

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token is not valid' });

        req.user = decoded; // Attach user info to request
        next();
    });
}

exports.generateToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        return token;
    } catch (error) {
        console.log(error);
    }
    return null;
}