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
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrder } from './purchase-order.schema';
import { PurchaseOrderDto } from './dto/purchase-order.dto';

@Controller('purchaseOrder')
@ApiTags('purchaseOrder')
export class PurchaseOrderController {
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('PurchaseOrder controller');
  }

  /**
   *
   * @get PurchaseOrder
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'PurchaseOrder')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get PurchaseOrder',
    type: PurchaseOrder,
  })
  getpurchaseOrder(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PurchaseOrder[]> {
    this.loggerService.log(`GET PurchaseOrder/ ${LoggerMessages.API_CALLED}`);
    return this.purchaseOrderService.getPurchaseOrder(pageOptionsDto);
  }
  /**
   *
   * @get PurchaseOrder by id
   * @param id
   * @return
   *
   */
  @Get('/byid/:id')
  @Auth(Action.Read, 'PurchaseOrder')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get PurchaseOrder By Id',
    type: PurchaseOrder,
  })
  async getPurchaseOrderById(
    @Param('id') id: string,
  ): Promise<PurchaseOrder[]> {
    this.loggerService.log(
      `GET PurchaseOrder By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.purchaseOrderService.findById(id);
  }

  /**
   *
   * @create PurchaseOrder
   * @param purchaseOrderDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'PurchaseOrder')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: PurchaseOrder, description: 'Successfully Created' })
  async create(
    @Body() purchaseOrderDto: PurchaseOrder,
  ): Promise<PurchaseOrder> {
    this.loggerService.log(`Post PurchaseOrder/ ${LoggerMessages.API_CALLED}`);

    const resp = await this.purchaseOrderService.create(purchaseOrderDto);
    return resp;
  }

  /**
   *
   * @update PurchaseOrder
   * @param purchaseOrderDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'PurchaseOrder')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: PurchaseOrder, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() purchaseOrderDto: PurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    this.loggerService.log(`Patch PurchaseOrder/ ${LoggerMessages.API_CALLED}`);
    return await this.purchaseOrderService.update(id, purchaseOrderDto);
  }

  /**
   *
   * @delete PurchaseOrder
   * @param PurchaseOrderDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'PurchaseOrder')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: PurchaseOrder, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<PurchaseOrder> {
    this.loggerService.log(
      `Delete PurchaseOrder/ ${LoggerMessages.API_CALLED}`,
    );
    return this.purchaseOrderService.delete(id);
  }

  /**
   *
   * @get purchaseOrder Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Premium')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Premium Schema',
    type: PurchaseOrder,
  })
  getPurchaseOrderSchema() {
    this.loggerService.log(
      `GET Purchase Order Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.purchaseOrderService.getSchema();
  }
}
