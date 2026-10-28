import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AuthProvider } from "./enums/auth_provider.enum";
import { Role } from "./enums/role.enum";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

@Entity('auth')
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid", nullable: false})
    uuid: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    email: string;

    @Column({ type: "varchar", nullable: true })
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({
        type: "enum",
        enum: AuthProvider,
        default: AuthProvider.LOCAL,
    })
    provider: string;

    @Column({ type: "varchar", nullable: true })
    provider_id: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER
    })
    role: Role

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    async comparePassword(password: string){
        return await bcrypt.compare(password, this.password);
    }
}