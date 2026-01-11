import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3206,
    database: 'BayIot',
    username: 'root',
    password: 'Sp0ng3B0B@Umicore',
});

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connect Success');
        const [results] = await sequelize.query("SHOW TABLES");
        console.log('Tables:', results);
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await sequelize.close();
    }
}

test();
