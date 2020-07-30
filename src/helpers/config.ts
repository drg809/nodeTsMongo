require('dotenv').config();

export default {
    jwtSecret: process.env.JWT_TOKEN_KEY || "testMongoBasics",
    port: process.env.PORT || 8080,
    retries: [
        'createSum',
        'updateSumHis',
        'update'
    ],
};
