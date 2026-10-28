import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1772529098177 implements MigrationInterface {
  name = 'InitMigration1772529098177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "education" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "instituteName" character varying NOT NULL, "degreeName" character varying NOT NULL, "startDate" character varying NOT NULL, "endDate" character varying NOT NULL, "Grade" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_bf3d38701b3030a8ad634d43bd6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "education" ADD CONSTRAINT "FK_723e67bde13b73c5404305feb14" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "education" DROP CONSTRAINT "FK_723e67bde13b73c5404305feb14"`,
    );
    await queryRunner.query(`DROP TABLE "education"`);
  }
}
