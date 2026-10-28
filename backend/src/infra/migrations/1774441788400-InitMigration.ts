import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1774441788400 implements MigrationInterface {
  name = 'InitMigration1774441788400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "firstName" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "firstName" SET NOT NULL`,
    );
  }
}
