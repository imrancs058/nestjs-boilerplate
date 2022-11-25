/* eslint-disable prettier/prettier */
import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.schema';
import { Role, RoleSchema } from './model/role.schema';
import { COA, COASchema } from './model/coa.schema';
import { ApprovedAccount, ApprovedAccountSchema } from './model/approvedAccount.schema';
import { UsersSeeder } from './seeder/users.seeder';
import { RoleSeeder } from './seeder/roles.seeder';
import { COASeeder } from './seeder/coa.seeder';
import { ApprovedAccountSeeder } from './seeder/approvedAccount.seeder';
import { CategorySeeder } from './seeder/category.seeder';
import { Category, CategorySchema } from './model/category.schema';
import { dbName } from 'src/configration/content.configuration';

seeder({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/game-of-thrones'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: COA.name, schema: COASchema },
      { name: ApprovedAccount.name, schema: ApprovedAccountSchema },
      { name: Category.name, schema: CategorySchema },
    ],dbName.primaryDBName),
  ],
}).run([
  UsersSeeder,
  RoleSeeder,
  COASeeder,
  ApprovedAccountSeeder,
  CategorySeeder,
]);
