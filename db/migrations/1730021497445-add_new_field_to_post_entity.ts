import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldToPostEntity1730021497445 implements MigrationInterface {
    name = 'AddNewFieldToPostEntity1730021497445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`summary\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`summary\``);
    }

}
