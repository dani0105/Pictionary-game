
const config = {
    database:{
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASWORD
    },
    server:{
        port:process.env.APP_PORT,
        host:process.env.APP_HOST,
        production: process.env.APP_PRODUCTION == 'true',
        tokenSecret: process.env.TOKEN_SECRET,
        tokenLife: process.env.TOKEN_LIFE
    },
    emails:{
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        email: process.env.EMAIL,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        clientRefreshToken: process.env.EMIAL_REFRESH_TOKEN
    },
    files:{
        public: process.env.PUBLIC_FILES,
        private: process.env.PRIVATE_FILES,
        logs: process.env.LOGS_FILES,
        temp: process.env.TEMP_FILES,
    }
}

module.exports = config;