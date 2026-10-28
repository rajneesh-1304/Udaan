import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1774849343870 implements MigrationInterface {
  name = 'InitMigration1774849343870';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "totalInvitations" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "totalInvitations"`,
    );
  }
}
