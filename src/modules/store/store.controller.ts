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
import { StoreService } from './store.service';
import { Store } from './store.schema';
import { StoreDto } from './dto/store.dto';

@Controller('store')
@ApiTags('store')
export class StoreController {
  constructor(
    private storeService: StoreService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Store controller');
  }

  /**
   *
   * @get Store
   * @param pageOptionsDto
   * @return
   *
   */
  @Get()
  @Auth(Action.Read, 'Store')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Store',
    type: Store,
  })
  getStore(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Store[]> {
    this.loggerService.log(`GET Store/ ${LoggerMessages.API_CALLED}`);
    return this.storeService.getStore(pageOptionsDto);
  }
  /**
   *
   * @get Store by id
   * @param id
   * @return
   *
   */
  @Get('/byid/:id')
  @Auth(Action.Read, 'Store')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Store By Id',
    type: Store,
  })
  async getStoreById(@Param('id') id: string): Promise<Store[]> {
    this.loggerService.log(`GET Store By Id/ ${LoggerMessages.API_CALLED}`);
    return this.storeService.findById(id);
  }

  /**
   *
   * @create Store
   * @param storeDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Store')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Store, description: 'Successfully Created' })
  async create(@Body() storeDto: StoreDto): Promise<Store> {
    this.loggerService.log(`Post Store/ ${LoggerMessages.API_CALLED}`);
    return await this.storeService.create(storeDto);
  }

  /**
   *
   * @update Store
   * @param storeDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Store')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Store, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() storeDto: StoreDto,
  ): Promise<Store> {
    this.loggerService.log(`Patch Store/ ${LoggerMessages.API_CALLED}`);
    return await this.storeService.update(id, storeDto);
  }

  /**
   *
   * @delete Store
   * @param StoreDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Store')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Store, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Store> {
    this.loggerService.log(`Delete Store/ ${LoggerMessages.API_CALLED}`);
    return this.storeService.delete(id);
  }

  /**
   *
   * @get Store Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Store')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Store Schema',
    type: Store,
  })
  getstoreSchema() {
    this.loggerService.log(`GET Store Schema/ ${LoggerMessages.API_CALLED}`);
    return this.storeService.getSchema();
  }

  /**
   *
   * @get Store
   * @param pageOptionsDto
   * @return
   *
   */
}
