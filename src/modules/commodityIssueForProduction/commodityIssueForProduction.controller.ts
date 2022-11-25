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
import { CommodityIssueForProductionService } from './commodityIssueForProduction.service';
import { ProductionOutputService } from '../productionOutput/productionOutput.service';
import { DryService } from '../dry/dry.service';
import { PackingService } from '../packing/packing.service';

import { CommodityIssueForProduction } from './commodityIssueForProduction.schema';
import { CommodityIssueForProductionDto } from './dto/commodityIssueForProduction.dto';
import { LabourExpenseService } from '../labourExpense/labourExpense.service';
import { StockService } from '../stock/stock.service';
import { ProductItemService } from '../productItem/productItem.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { CategoryService } from '../category/category.service';
import { PackingSizeService } from '../packingSize/packingSize.service';
import mongoose from 'mongoose';

@Controller('commodityIssueForProduction')
@ApiTags('commodityIssueForProduction')
export class CommodityIssueForProductionController {
  constructor(
    private commodityIssueForProductionService: CommodityIssueForProductionService,
    private productionOutputService: ProductionOutputService,
    private dryService: DryService,
    private packingService: PackingService,
    private stockService: StockService,
    private productItemService: ProductItemService,
    private packingSizeService: PackingSizeService,
    private purchaseOrderService: PurchaseOrderService,
    private categoryService: CategoryService,
    private labourExpenseService: LabourExpenseService,

    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('CommodityIssueForProduction controller');
  }

  /**
   *
   * @get CommodityIssueForProduction
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'CommodityIssueForProduction')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get CommodityIssueForProduction',
    type: CommodityIssueForProduction,
  })
  getCommodityIssueForProduction(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<CommodityIssueForProduction[]> {
    this.loggerService.log(
      `GET CommodityIssueForProduction/ ${LoggerMessages.API_CALLED}`,
    );
    return this.commodityIssueForProductionService.getCommodityIssueForProduction(
      pageOptionsDto,
    );
  }
  /**
   *
   * @get CommodityIssueForProduction by id
   * @param id
   * @return
   *
   */
  @Get('byid/:id')
  @Auth(Action.Read, 'CommodityIssueForProduction')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get CommodityIssueForProduction By Id',
    type: CommodityIssueForProduction,
  })
  async getCommodityIssueForProductionById(
    @Param('id') id: string,
  ): Promise<CommodityIssueForProduction[]> {
    this.loggerService.log(
      `GET CommodityIssueForProduction By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.commodityIssueForProductionService.findById(id);
  }

  /**
   *
   * @create CommodityIssueForProduction
   * @param commodityIssueForProductionData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'CommodityIssueForProduction')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: CommodityIssueForProduction,
    description: 'Successfully Created',
  })
  async create(
    @Body() commodityIssueForProductionData: CommodityIssueForProduction,
  ): Promise<CommodityIssueForProduction> {
    this.loggerService.log(
      `Post CommodityIssueForProduction/ ${LoggerMessages.API_CALLED}`,
    );
    const resp = await this.commodityIssueForProductionService.create(
      commodityIssueForProductionData,
    );

    return;
  }

  /**
   *
   * @update CommodityIssueForProduction
   * @param commodityIssueForProductionDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'CommodityIssueForProduction')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({
    type: CommodityIssueForProduction,
    description: 'Updated Sucessfully',
  })
  async update(
    @Param('id') id: string,
    @Body() commodityIssueForProductionDto: CommodityIssueForProductionDto,
  ): Promise<CommodityIssueForProduction> {
    this.loggerService.log(
      `Patch CommodityIssueForProduction/ ${LoggerMessages.API_CALLED}`,
    );
    return await this.commodityIssueForProductionService.update(
      id,
      commodityIssueForProductionDto,
    );
  }

  /**
   *
   * @delete CommodityIssueForProduction
   * @param CommodityIssueForProductionDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'CommodityIssueForProduction')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({
    type: CommodityIssueForProduction,
    description: 'Delete Sucessfully',
  })
  async delete(@Param('id') id: string): Promise<CommodityIssueForProduction> {
    this.loggerService.log(
      `Delete CommodityIssueForProduction/ ${LoggerMessages.API_CALLED}`,
    );
    return this.commodityIssueForProductionService.delete(id);
  }
  /**
   *
   * @get Commodity Issue For Production Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Commodity Issue For Production')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Commodity Issue For Production Schema',
    type: CommodityIssueForProduction,
  })
  getCommodityIssueForProductionSchema() {
    this.loggerService.log(
      `GET Commodity Issue For Production Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.commodityIssueForProductionService.getSchema();
  }
}
