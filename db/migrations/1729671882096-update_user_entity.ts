import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1729671882096 implements MigrationInterface {
    name = 'UpdateUserEntity1729671882096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
