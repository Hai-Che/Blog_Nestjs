import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeAttributeOfRefreshToken1726743449767 implements MigrationInterface {
    name = 'ChangeAttributeOfRefreshToken1726743449767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
