import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleFieldToUserEntity1730185033083 implements MigrationInterface {
    name = 'AddRoleFieldToUserEntity1730185033083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'User'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
    }

}
