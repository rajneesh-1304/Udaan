import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1773991376129 implements MigrationInterface {
  name = 'InitMigration1773991376129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "totalFollowers" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "totalConnections" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "totalConnections"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "totalFollowers"`);
  }
}
