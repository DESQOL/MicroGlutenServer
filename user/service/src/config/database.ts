import { ConnectionOptions } from "typeorm";
import appRoot from 'app-root-path';

const databaseConfiguration: ConnectionOptions = {
    type: "mysql",
    host: "database",
    port: 3306,
    username: "gluten",
    password: "gluten",
    database: "gluten",
    synchronize: true,
    logging: false,
    entities: [
        `${appRoot}/src/entity/**/*.ts`,
        `${appRoot}/dist/entity/**/*.js`,
    ],
    migrations: [
        `${appRoot}/src/migration/**/*.ts`,
        `${appRoot}/dist/migration/**/*.js`,
    ],
    subscribers: [
        `${appRoot}/src/subscriber/**/*.ts`,
        `${appRoot}/dist/subscriber/**/*.js`,
    ],
    cache: {
        type: 'redis',
        options: {
            host: 'cache',
            port: 6379
        },
        duration: 1 * 1000
    }
}

export { databaseConfiguration };
