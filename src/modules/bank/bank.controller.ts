/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  // eslint-disable-next-line prettier/prettier
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
import { BankService } from './bank.service';
import { Bank } from './bank.schema';
import { BankDtoDto } from './dto/bankDto.dto';

@Controller('bank')
@ApiTags('bank')
export class BankController {
  constructor(
    private bankService: BankService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Bank controller');
  }

  /**
   *
   * @get Bank
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Bank')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Bank',
    type: Bank,
  })
  getBank(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Bank[]> {
    this.loggerService.log(`GET Bank/ ${LoggerMessages.API_CALLED}`);
    return this.bankService.getBank(pageOptionsDto);
  }
  /**
   *
   * @get Bank by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'Bank')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Bank By Id',
    type: Bank,
  })
  async getBankById(@Param('id') id: string): Promise<Bank[]> {
    this.loggerService.log(`GET Bank By Id/ ${LoggerMessages.API_CALLED}`);
    return this.bankService.findById(id);
  }

  /**
   *
   * @create Bank
   * @param bankData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Bank')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Bank, description: 'Successfully Created' })
  async create(@Body() bankData: Bank): Promise<Bank> {
    this.loggerService.log(`Post Bank/ ${LoggerMessages.API_CALLED}`);
    return await this.bankService.create(bankData);
  }

  /**
   *
   * @update Bank
   * @param bankDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Bank')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Bank, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() bankDto: BankDtoDto,
  ): Promise<Bank> {
    this.loggerService.log(`Patch Bank/ ${LoggerMessages.API_CALLED}`);
    return await this.bankService.update(id, bankDto);
  }

  /**
   *
   * @delete Bank
   * @param BankDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Bank')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Bank, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Bank> {
    this.loggerService.log(`Delete Bank/ ${LoggerMessages.API_CALLED}`);
    return this.bankService.delete(id);
  }
  /**
   *
   * @get Bank Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Bank')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Bank Schema',
    type: Bank,
  })
  getbankSchema() {
    this.loggerService.log(`GET Bank Schema/ ${LoggerMessages.API_CALLED}`);
    return this.bankService.getSchema();
  }
}
