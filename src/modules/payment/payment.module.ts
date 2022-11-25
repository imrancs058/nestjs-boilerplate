import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment, PaymentSchema } from './payment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Payment.name, schema: PaymentSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
