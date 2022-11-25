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
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.schema';

@Controller('warehouse')
@ApiTags('warehouse')
export class WarehouseController {
  constructor(
    private warehouseService: WarehouseService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Warehouse controller');
  }

  /**
   *
   * @get Warehouse
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Warehouse')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Warehouse',
    type: Warehouse,
  })
  getWarehouse(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Warehouse[]> {
    this.loggerService.log(`GET Warehouse/ ${LoggerMessages.API_CALLED}`);
    return this.warehouseService.getWarehouse(pageOptionsDto);
  }
  /**
   *
   * @get WarehouseByStore
   * @param
   * @return
   *
   */
  @Get('WarehouseByStore')
  @Auth(Action.Read, 'Warehouse')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Warehouse By Store',
    type: Warehouse,
  })
  WarehousebyStore(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Warehouse[]> {
    this.loggerService.log(
      `GET Warehouse By Store/ ${LoggerMessages.API_CALLED}`,
    );
    return this.warehouseService.getWarehouse(pageOptionsDto);
  }

  /**
   *
   * @get Warehouse by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'Warehouse')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Warehouse By Id',
    type: Warehouse,
  })
  async getWarehouseById(@Param('id') id: string): Promise<Warehouse[]> {
    this.loggerService.log(`GET Warehouse By Id/ ${LoggerMessages.API_CALLED}`);
    return this.warehouseService.findById(id);
  }

  /**
   *
   * @create Warehouse
   * @param warehouseDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Warehouse')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Warehouse, description: 'Successfully Created' })
  async create(@Body() warehouseDto: Partial<Warehouse>): Promise<Warehouse> {
    this.loggerService.log(`Post Warehouse/ ${LoggerMessages.API_CALLED}`);
    return await this.warehouseService.create(warehouseDto);
  }

  /**
   *
   * @update Warehouse
   * @param warehouseDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Warehouse')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Warehouse, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() warehouseDto: Partial<Warehouse>,
  ): Promise<Warehouse> {
    this.loggerService.log(`Patch Warehouse/ ${LoggerMessages.API_CALLED}`);
    return await this.warehouseService.update(id, warehouseDto);
  }

  /**
   *
   * @delete Warehouse
   * @param id
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Warehouse')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Warehouse, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Warehouse> {
    this.loggerService.log(`Delete Warehouse/ ${LoggerMessages.API_CALLED}`);
    return this.warehouseService.delete(id);
  }

  /**
   *
   * @get warehouse Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Warehouse')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Warehouse Schema',
    type: Warehouse,
  })
  getwarehouseSchema() {
    this.loggerService.log(
      `GET Warehouse Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.warehouseService.getSchema();
  }
}
