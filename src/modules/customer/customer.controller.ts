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
import { CustomerService } from './customer.service';
import { Customer } from './customer.schema';
import { CustomerDtoDto } from './dto/customerDto.dto';

@Controller('customer')
@ApiTags('customer')
export class CustomerController {
  constructor(
    private customerService: CustomerService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Customer controller');
  }

  /**
   *
   * @get Customer
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Customer')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Customer',
    type: Customer,
  })
  getCustomer(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Customer[]> {
    this.loggerService.log(`GET Customer/ ${LoggerMessages.API_CALLED}`);
    return this.customerService.getCustomer(pageOptionsDto);
  }
  /**
   *
   * @get Customer by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'Customer')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Customer By Id',
    type: Customer,
  })
  async getCustomerById(@Param('id') id: string): Promise<Customer[]> {
    this.loggerService.log(`GET Customer By Id/ ${LoggerMessages.API_CALLED}`);
    return this.customerService.findById(id);
  }

  /**
   *
   * @create Customer
   * @param customerData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Customer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Customer, description: 'Successfully Created' })
  async create(@Body() customerData: Customer): Promise<Customer> {
    this.loggerService.log(`Post Customer/ ${LoggerMessages.API_CALLED}`);
    return await this.customerService.create(customerData);
  }

  /**
   *
   * @update Customer
   * @param customerDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Customer')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Customer, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() customerDto: CustomerDtoDto,
  ): Promise<Customer> {
    this.loggerService.log(`Patch Customer/ ${LoggerMessages.API_CALLED}`);
    return await this.customerService.update(id, customerDto);
  }

  /**
   *
   * @delete Customer
   * @param CustomerDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Customer')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Customer, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Customer> {
    this.loggerService.log(`Delete Customer/ ${LoggerMessages.API_CALLED}`);
    return this.customerService.delete(id);
  }
  /**
   *
   * @get Customer Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Customer')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Customer Schema',
    type: Customer,
  })
  getcustomerSchema() {
    this.loggerService.log(`GET Customer Schema/ ${LoggerMessages.API_CALLED}`);
    return this.customerService.getSchema();
  }
}
