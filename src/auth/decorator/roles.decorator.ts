import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/shared/enums';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);