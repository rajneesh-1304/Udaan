// import { MigrationInterface, QueryRunner, Table } from "typeorm";

// export class CreateUsersTable1772427205101 implements MigrationInterface {

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.createTable(
//             new Table({
//                 name: "users",
//                 columns: [
//                     {
//                         name: "id",
//                         type: "int",
//                         isPrimary: true,
//                         isGenerated: true,
//                         generationStrategy: "increment",
//                     },
//                     {
//                         name: "displayName",
//                         type: "varchar",
//                     },
//                     {
//                         name: "email",
//                         type: "varchar",
//                         isUnique: true,
//                     },
//                     // {
//                     //     name: "role",
//                     //     type: "varchar",
//                     // },
//                     {
//                         name: "createdAt",
//                         type: "timestamp",
//                         default: "CURRENT_TIMESTAMP",
//                     },
//                     {
//                         name: "isBanned",
//                         type: "boolean",
//                         default: false,
//                     },
//                 ],
//             }),
//             true,
//         )
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.dropTable("users")
//     }
// }