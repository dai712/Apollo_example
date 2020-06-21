import {ConnectionOptions } from "typeorm";


const connectionOptions: ConnectionOptions=
{
    "type": "sqlite",
    "database": "database.sqlite",
    "synchronize": true,
    "logging": true,
    "entities": ["src/api/entity/**/*.ts"],
    "migrations": ["src/api/migration/**/*.ts"],
    "subscribers": ["src/api/subscriber/**/*.ts"],
    "cli": {
        "entitiesDir": "src/api/entity",
        "migrationsDir": "src/api/migration",
        "subscribersDir": "src/api/subscriber"
    },
}

export default connectionOptions