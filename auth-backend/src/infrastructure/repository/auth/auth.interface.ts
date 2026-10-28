import { AuthProvider } from "src/domain/auth/enums/auth_provider.enum";
import { Role } from "src/domain/auth/enums/role.enum";

export interface AuthPayload {
    uuid?: string;
    email: string;
    password?: string;
    provider?: AuthProvider;
    provider_id?: string;
    role?: Role;
    created_at?: Date;
    updated_at?: Date;
}