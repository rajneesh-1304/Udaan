import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class OutboxMessage1793178905386 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."outbox_message_status_enum"
      AS ENUM('PENDING', 'SENT');
    `);

    await queryRunner.createTable(
      new Table({
        name: 'outbox_message',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'message_id',
            type: 'uuid',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'exchange',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'routing_key',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'headers',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'properties',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'body',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'status',
            type: '"public"."outbox_message_status_enum"',
            default: "'PENDING'",
            isNullable: false,
          },
          {
            name: 'sent_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('outbox_message');

    await queryRunner.query(`
      DROP TYPE "public"."outbox_message_status_enum";
    `);
  }
}