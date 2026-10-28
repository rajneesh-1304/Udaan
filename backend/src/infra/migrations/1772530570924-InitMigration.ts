import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1772530570924 implements MigrationInterface {
  name = 'InitMigration1772530570924';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "experience" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" character varying NOT NULL, "company" character varying NOT NULL, "startDate" character varying NOT NULL, "endDate" character varying NOT NULL, "location" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "experience" ADD CONSTRAINT "FK_cbfb1d1219454c9b45f1b3c4274" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experience" DROP CONSTRAINT "FK_cbfb1d1219454c9b45f1b3c4274"`,
    );
    await queryRunner.query(`DROP TABLE "experience"`);
  }
}
