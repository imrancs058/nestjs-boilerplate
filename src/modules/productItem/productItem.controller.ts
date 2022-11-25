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
import { ProductItemService } from './productItem.service';
import { ProductItem } from './productItem.schema';
import { ProductItemDto } from './dto/productItem.dto';

@Controller('productItem')
@ApiTags('productItem')
export class ProductItemController {
  constructor(
    private productItemService: ProductItemService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('ProductItem controller');
  }

  /**
   *
   * @get ProductItem
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'ProductItem')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get ProductItem',
    type: ProductItem,
  })
  getProductItem(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<ProductItem[]> {
    this.loggerService.log(`GET ProductItem/ ${LoggerMessages.API_CALLED}`);
    return this.productItemService.getProductItem(pageOptionsDto);
  }
  /**
   *
   * @get ProductItem by id
   * @param id
   * @return
   *
   */
  @Get('byid/:id')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get ProductItem By Id',
    type: ProductItem,
  })
  async getProductItemById(@Param('id') id: string): Promise<ProductItem[]> {
    this.loggerService.log(
      `GET ProductItem By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.productItemService.findById(id);
  }

  /**
   *
   * @create ProductItem
   * @param productItem
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'ProductItem')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ProductItem, description: 'Successfully Created' })
  async create(@Body() productItem: ProductItem): Promise<ProductItem> {
    this.loggerService.log(`Post ProductItem/ ${LoggerMessages.API_CALLED}`);
    return await this.productItemService.create(productItem);
  }

  /**
   *
   * @update ProductItem
   * @param productItemDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'ProductItem')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: ProductItem, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() productItemDto: ProductItemDto,
  ): Promise<ProductItem> {
    this.loggerService.log(`Patch ProductItem/ ${LoggerMessages.API_CALLED}`);
    return await this.productItemService.update(id, productItemDto);
  }

  /**
   *
   * @delete ProductItem
   * @param ProductItemDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'ProductItem')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: ProductItem, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<ProductItem> {
    this.loggerService.log(`Delete ProductItem/ ${LoggerMessages.API_CALLED}`);
    return this.productItemService.delete(id);
  }
  /**
   *
   * @get product Item Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Product Item')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Product Item Schema',
    type: ProductItem,
  })
  getproductItemSchema() {
    this.loggerService.log(
      `GET Product Item Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.productItemService.getSchema();
  }
}
