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
import { SaleStoreService } from './saleStore.service';
import { SaleStore } from './saleStore.schema';
import { SaleStoreDto } from './dto/saleStore.dto';

@Controller('saleStore')
@ApiTags('saleStore')
export class SaleStoreController {
  constructor(
    private saleStoreService: SaleStoreService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('SaleStore controller');
  }

  /**
   *
   * @get SaleStore
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'SaleStore')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get SaleStore',
    type: SaleStore,
  })
  getSaleStore(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<SaleStore[]> {
    this.loggerService.log(`GET SaleStore/ ${LoggerMessages.API_CALLED}`);
    return this.saleStoreService.getSaleStore(pageOptionsDto);
  }
  /**
   *
   * @get SaleStore by id
   * @param id
   * @return
   *
   */
  @Get('byid/:id')
  @Auth(Action.Read, 'SaleStore')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get SaleStore By Id',
    type: SaleStore,
  })
  async getSaleStoreById(@Param('id') id: string): Promise<SaleStore[]> {
    this.loggerService.log(`GET SaleStore By Id/ ${LoggerMessages.API_CALLED}`);
    return this.saleStoreService.findById(id);
  }

  /**
   *
   * @create SaleStore
   * @param saleStoreDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'SaleStore')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: SaleStore, description: 'Successfully Created' })
  async create(@Body() saleStoreDto: SaleStoreDto): Promise<SaleStore> {
    this.loggerService.log(`Post SaleStore/ ${LoggerMessages.API_CALLED}`);
    return await this.saleStoreService.create(saleStoreDto);
  }

  /**
   *
   * @update SaleStore
   * @param saleStoreDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'SaleStore')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: SaleStore, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() saleStoreDto: SaleStoreDto,
  ): Promise<SaleStore> {
    this.loggerService.log(`Patch SaleStore/ ${LoggerMessages.API_CALLED}`);
    return await this.saleStoreService.update(id, saleStoreDto);
  }

  /**
   *
   * @delete SaleStore
   * @param SaleStoreDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'SaleStore')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: SaleStore, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<SaleStore> {
    this.loggerService.log(`Delete SaleStore/ ${LoggerMessages.API_CALLED}`);
    return this.saleStoreService.delete(id);
  }
  /**
   *
   * @get sale Store Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Sale Store')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Sale Store Schema',
    type: SaleStore,
  })
  getsaleStoreSchema() {
    this.loggerService.log(
      `GET Sale Store Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.saleStoreService.getSchema();
  }
}
