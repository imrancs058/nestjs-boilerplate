/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  // eslint-disable-next-line prettier/prettier
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
import { AccTransactionService } from './acc_transaction.service';
import { AccTransaction } from './acc_transaction.schema';

@Controller('accTransaction')
@ApiTags('accTransaction')
export class AccTransactionController {
  constructor(
    private accTransactionService: AccTransactionService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('AccTransaction controller');
  }

  /**
   *
   * @get AccTransaction
   * @param pageOptionsDto
   * @return
   *
   */
   @Get('list')
   @Auth(Action.Read, 'AccTransaction')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get AccTransaction',
     type: AccTransaction,
   })
   getAccTransaction(
     @Query(new ValidationPipe({ transform: true }))
     pageOptionsDto: PageOptionsDto,
   ): Promise<AccTransaction[]> {
     this.loggerService.log(`GET AccTransaction/ ${LoggerMessages.API_CALLED}`);
     return this.accTransactionService.getAccTransactionByCoaID(pageOptionsDto);
   }

   /**
   *
   * @get AccTransaction by Invoice and CoaID
   * @param pageOptionsDto
   * @return
   *
   */
   @Get('listbyinvoice')
   @Auth(Action.Read, 'AccTransaction')
   @HttpCode(HttpStatus.OK)
   @ApiPageOkResponse({
     description: 'Get AccTransaction',
     type: AccTransaction,
   })
   getAccTransactionByInvoiceAndCoa(
     @Query(new ValidationPipe({ transform: true }))
     pageOptionsDto: PageOptionsDto,
   ): Promise<AccTransaction[]> {
     this.loggerService.log(`GET AccTransaction/ ${LoggerMessages.API_CALLED}`);
     return this.accTransactionService.getAccTransactionByCoaIDAndInvoice(pageOptionsDto);
   }

  /**
   *
   * @create AccTransaction
   * @param accTransactionData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'AccTransaction')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: AccTransaction, description: 'Successfully Created' })
  async create(@Body() accTransactionData: AccTransaction): Promise<AccTransaction> {
    this.loggerService.log(`Post AccTransaction/ ${LoggerMessages.API_CALLED}`);
    return await this.accTransactionService.create(accTransactionData);
  }

  /**
   *
   * @get AccTransaction Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'AccTransaction')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get AccTransaction Schema',
    type: AccTransaction,
  })
  getAccTransactionSchema() {
    this.loggerService.log(`GET AccTransaction Schema/ ${LoggerMessages.API_CALLED}`);
    return this.accTransactionService.getSchema();
  }
}
