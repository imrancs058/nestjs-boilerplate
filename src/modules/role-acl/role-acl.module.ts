import { Module } from '@nestjs/common';
import { RoleAclService } from './role-acl.service';
import { RoleAclController } from './role-acl.controller';
import { RoleAcl, RoleAclSchema } from './role-acl.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModule } from '../permission/permission.module';
import { dbName } from '../../configration/content.configuration';
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: RoleAcl.name, schema: RoleAclSchema }],
      dbName.primaryDBName,
    ),
    PermissionModule,
  ],
  providers: [RoleAclService],
  controllers: [RoleAclController],
})
export class RoleAclModule {}
