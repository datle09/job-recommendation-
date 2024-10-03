import { UserRole } from "src/shared/enums";

export interface PayloadType {
    userId: number;
    email: string;
    role: UserRole;
}