// Config that is common to more than one part of the app.

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Channel } from './models/Channel';
import { Post, PostMedia } from './models/Post';
import { Creator } from './models/Creator';
import { SocialLink } from './models/SocialLink';

const typeOrmConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "cienciacafe",
    synchronize: true,
    logging: false,
    entities: [
        Channel,
        Creator,
        Post,
        PostMedia,
        SocialLink,
    ]
};

export { typeOrmConfig };