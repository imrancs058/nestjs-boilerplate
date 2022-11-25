import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslService } from './casl.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schema';
import { dbName } from 'src/configration/content.configuration';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Role.name, schema: RoleSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [CaslAbilityFactory, CaslService],
  exports: [CaslAbilityFactory, CaslService],
})
export class CaslModule {}
