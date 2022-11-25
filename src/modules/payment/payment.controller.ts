import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse, Auth } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PaymentService } from './payment.service';
import { Payment } from './payment.schema';
import { PaymentDtoDto } from './dto/paymentDto.dto';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Payment controller');
  }

  /**
   *
   * @get Payment
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Payment')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Payment',
    type: Payment,
  })
  getPayment(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Payment[]> {
    this.loggerService.log(`GET Payment/ ${LoggerMessages.API_CALLED}`);
    return this.paymentService.getPayment(pageOptionsDto);
  }
  /**
   *
   * @get Payment by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'Payment')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Payment By Id',
    type: Payment,
  })
  async getPaymentById(@Param('id') id: string): Promise<Payment[]> {
    this.loggerService.log(`GET Payment By Id/ ${LoggerMessages.API_CALLED}`);
    return this.paymentService.findById(id);
  }

  /**
   *
   * @create Payment
   * @param paymentData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Payment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Payment, description: 'Successfully Created' })
  async create(@Body() paymentData: Payment): Promise<Payment> {
    this.loggerService.log(`Post Payment/ ${LoggerMessages.API_CALLED}`);
    return await this.paymentService.create(paymentData);
  }

  /**
   *
   * @update Payment
   * @param paymentDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Payment')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Payment, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() paymentDto: PaymentDtoDto,
  ): Promise<Payment> {
    this.loggerService.log(`Patch Payment/ ${LoggerMessages.API_CALLED}`);
    return await this.paymentService.update(id, paymentDto);
  }

  /**
   *
   * @delete Payment
   * @param PaymentDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Payment')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Payment, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Payment> {
    this.loggerService.log(`Delete Payment/ ${LoggerMessages.API_CALLED}`);
    return this.paymentService.delete(id);
  }
  /**
   *
   * @get Payment Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Payment')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Payment Schema',
    type: Payment,
  })
  getpaymentSchema() {
    this.loggerService.log(`GET Payment Schema/ ${LoggerMessages.API_CALLED}`);
    return this.paymentService.getSchema();
  }
}
