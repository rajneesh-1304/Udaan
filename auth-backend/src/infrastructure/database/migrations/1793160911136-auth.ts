import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Auth1793160911136 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."auth_provider_enum" AS ENUM('GOOGLE', 'LOCAL');
            CREATE TYPE "public"."auth_role_enum" AS ENUM('ADMIN', 'USER');
        `);
        await queryRunner.createTable(
            new Table({
                name: "auth",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "uuid",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: "password",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "provider",
                        type: '"public"."auth_provider_enum"',
                        default: "'LOCAL'",
                        isNullable: false
                    },
                    {
                        name: "provider_id",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "role",
                        type: '"public"."auth_role_enum"',
                        default: "'USER'",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    }
                ]
            }),
            true
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
        await queryRunner.query(`DROP TYPE "public"."auth_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."auth_provider_enum"`);
    }

}
