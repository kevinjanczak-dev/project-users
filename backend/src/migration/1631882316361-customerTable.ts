import {MigrationInterface, QueryRunner} from "typeorm";

export class customerTable1631882316361 implements MigrationInterface {
    name = 'customerTable1631882316361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`db_users\`.\`customer_phone\` (\`id\` int NOT NULL AUTO_INCREMENT, \`default\` tinyint NOT NULL DEFAULT 0, \`phone\` varchar(255) NOT NULL, \`customerId\` int NULL, UNIQUE INDEX \`IDX_ddf0fc965b006fec1ac68e5bf4\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`db_users\`.\`customer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`cpf\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_fdb2f3ad8115da4c7718109a6e\` (\`email\`), UNIQUE INDEX \`IDX_e96edf3964ada73dc7e048d4f3\` (\`cpf\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`db_users\`.\`customer_phone\` ADD CONSTRAINT \`FK_92ef29d644f9866d3e1a8508fa3\` FOREIGN KEY (\`customerId\`) REFERENCES \`db_users\`.\`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`db_users\`.\`customer_phone\` DROP FOREIGN KEY \`FK_92ef29d644f9866d3e1a8508fa3\``);
        await queryRunner.query(`DROP INDEX \`IDX_e96edf3964ada73dc7e048d4f3\` ON \`db_users\`.\`customer\``);
        await queryRunner.query(`DROP INDEX \`IDX_fdb2f3ad8115da4c7718109a6e\` ON \`db_users\`.\`customer\``);
        await queryRunner.query(`DROP TABLE \`db_users\`.\`customer\``);
        await queryRunner.query(`DROP INDEX \`IDX_ddf0fc965b006fec1ac68e5bf4\` ON \`db_users\`.\`customer_phone\``);
        await queryRunner.query(`DROP TABLE \`db_users\`.\`customer_phone\``);
    }

}
