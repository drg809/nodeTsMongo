require('dotenv').config();

export default {
    jwtSecret: process.env.JWT_TOKEN_KEY || "testMongoBasics",
    port: process.env.PORT || 8080,
    retries: [
        'createSum',
        'updateSumHis',
        'update'
    ],
    mongoUrl: 'mongodb://127.0.0.1:27017/tftanalitics',
    leagues: [
        'IRON',
        'BRONZE',
        'SILVER',
        'GOLD',
        'PLATINUM',
        'DIAMOND'
    ],
    rank: [
        'I',
        'II',
        'III',
        'IV'
    ],
    apexLeagues: [
        'getMasterLeague',
        'getGrandmasterLeague',
        'getChallengerLeague'
    ]
};
