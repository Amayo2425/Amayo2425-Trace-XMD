const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'WILLIS_2025_eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS0tUd05zNGlCZ082dllHKzhYU0JjS0FuNmx1L0tCclJ5cWhPQ1hpa1RFaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUHlzSUhoaUpUaXpqSUNEQVZQekJadUp5cEozMmhXaWQ1Z3N5NGlqK1hVOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFRTZJb0ZGTnlBUERVaVJmQ0JPUmJoWXFXc2ozQm91bTdHZk81K1VHZzFRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ5TEZGK3JFSWN2ZHBoK1k3cWV6cVVqN0RDbTdML1M1SG9tUUVyanR6a0NRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IitJc2NLNUJITmlaRlVEM05TcTRoYmJ6OEQ1QVh2ZTYyaXRpRFN2bmRzVWc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ii9PeHdRRWo4Wnh1Ly9tczRYWXIwcTZ2cGZUN0xKZ3M4WkRpN2ZNZE1ZMEk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMk51QkVJL1VFTUh6b3dxVkV5RUJvMlZqZGZMYXZFZDBHKzFXS0RQck5rMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTUZ2cGJCL3lndHBtTDdDeGUveG5SVVJMUGJ1V1BXUWlDaHlLeGtTS1RGQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImpKcWozSGVXWndFd0FKZ1RzNWlNa09aSTdYbCs4Yi9iRVB2U3cyS3BCOWxrejc1S0NlRjJEdnlQZExtM1BHeVpDUWZLYjJOWTJ4T3ZZazNJT09ML0FnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTA0LCJhZHZTZWNyZXRLZXkiOiIvekhKOWRNcXYrZnBYL2kwUXJPQlNRa2wyWFBHMThKaGVRSWNoTCs0SFIwPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJFeFl1ZWtkZlNQV2VZLWVCdzFNMXdRIiwicGhvbmVJZCI6IjNmODNlY2VkLTgyYTYtNDZlZi1hYjU4LWRjNjllNDQyMzUwNiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ5ZDN6Uk1aZVNrdGVqUEEvaFpFODdBakx1VkU9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYkZJMW9KM2p5ek8rczliQ2dmQllLUkNCV3A0PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlJHUVFXVjc2IiwibWUiOnsiaWQiOiIyNTQ3OTIwNTczMDY6NTZAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiQ2xpbnRvbiJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUHlINU1ZQ0VPSEJvOEFHR0JrZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiaFRsU3UwM1l2dHRkUTJnK1M3YVppL3hOT2lGdndvdlpiTzExNjBtYS9DVT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiTU9QWDdvTnJZZURsNGNiNk1sL1pHbUhaVkJFZDM2aUgxNHBEVU9qVzh2MVdGa0poQUFrZnhsa1dNUEFuZHJ0SzI2WkFjSGNRSjgzM0k1MFdmVm44QWc9PSIsImRldmljZVNpZ25hdHVyZSI6InBBbzhKSnhKNnoycUlySXZmZjJ4N01XQmhWUmhtY3JFTDN3ZWF5MVRqUXhjVUNIL2xmUHJSd2N6ZjVBVDRvQm9BU1dRQTVKOFBEM05rRldhMkF5akFRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzkyMDU3MzA2OjU2QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQllVNVVydE4yTDdiWFVOb1BrdTJtWXY4VFRvaGI4S0wyV3p0ZGV0Sm12d2wifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NDU0MTIzMzUsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTHlNIn0=',
    PREFIXES: (process.env.PREFIX || '.').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "Thunder",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254792057306",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "on",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'on',
    URL: process.env.MENU_LINKS || 'https://telegra.ph/file/d7b133573a5a3622775e6.jpg',
    MODE: process.env.BOT_MODE || "public",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
