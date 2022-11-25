/* eslint-disable prettier/prettier */
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
import { StockService } from './stock.service';
import { Stock } from './stock.schema';
import { StockDto } from './dto/stockDto.dto';
@Controller('stock')
@ApiTags('stock')
export class StockController {
  constructor(
    private stockService: StockService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Stock controller');
  }

  /**
   *
   * @get Stock
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Stock')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Stock',
    type: Stock,
  })
  getStock(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Stock[]> {
    this.loggerService.log(`GET Stock/ ${LoggerMessages.API_CALLED}`);
    return this.stockService.getStock(pageOptionsDto);
  }
  /**
   *
   * @get Stock by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'Stock')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Stock By Id',
    type: Stock,
  })
  async getStockById(@Param('id') id: string): Promise<Stock[]> {
    this.loggerService.log(`GET Stock By Id/ ${LoggerMessages.API_CALLED}`);
    return this.stockService.findById(id);
  }

  /**
   *
   * @create Stock
   * @param stockDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Stock')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Stock, description: 'Successfully Created' })
  async create(@Body() stockDto: Stock): Promise<Stock> {
    this.loggerService.log(`Post Stock/ ${LoggerMessages.API_CALLED}`);
    return await this.stockService.create(stockDto);
  }

  /**
   *
   * @update Stock
   * @param stockDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Stock')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Stock, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() stockDto: StockDto,
  ): Promise<Stock> {
    this.loggerService.log(`Patch Stock/ ${LoggerMessages.API_CALLED}`);
    return await this.stockService.update(id, stockDto);
  }

  /**
   *
   * @delete Stock
   * @param StockDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Stock')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Stock, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Stock> {
    this.loggerService.log(`Delete Stock/ ${LoggerMessages.API_CALLED}`);
    return this.stockService.delete(id);
  }
  /**
   *
   * @get stock Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Stock')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Stock Schema',
    type: Stock,
  })
  getstockSchema() {
    this.loggerService.log(`GET Stock Schema/ ${LoggerMessages.API_CALLED}`);
    return this.stockService.getSchema();
  }
}
