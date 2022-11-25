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
import { PackingSizeService } from './packingSize.service';
import { PackingSize } from './packingSize.schema';
import { PackingSizeDtoDto } from './dto/packingSizeDto.dto';

@Controller('packingSize')
@ApiTags('packingSize')
export class PackingSizeController {
  constructor(
    private packingSizeService: PackingSizeService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('PackingSize controller');
  }

  /**
   *
   * @get PackingSize
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'PackingSize')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get PackingSize',
    type: PackingSize,
  })
  getPackingSize(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PackingSize[]> {
    this.loggerService.log(`GET PackingSize/ ${LoggerMessages.API_CALLED}`);
    return this.packingSizeService.getPackingSize(pageOptionsDto);
  }
  /**
   *
   * @get PackingSize by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'PackingSize')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get PackingSize By Id',
    type: PackingSize,
  })
  async getPackingSizeById(@Param('id') id: string): Promise<PackingSize[]> {
    this.loggerService.log(
      `GET PackingSize By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.packingSizeService.findById(id);
  }

  /**
   *
   * @create PackingSize
   * @param packingSizeData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'PackingSize')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: PackingSize, description: 'Successfully Created' })
  async create(@Body() packingSizeData: PackingSize): Promise<PackingSize> {
    this.loggerService.log(`Post PackingSize/ ${LoggerMessages.API_CALLED}`);
    return await this.packingSizeService.create(packingSizeData);
  }

  /**
   *
   * @update PackingSize
   * @param packingSizeDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'PackingSize')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: PackingSize, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() packingSizeDto: PackingSizeDtoDto,
  ): Promise<PackingSize> {
    this.loggerService.log(`Patch PackingSize/ ${LoggerMessages.API_CALLED}`);
    return await this.packingSizeService.update(id, packingSizeDto);
  }

  /**
   *
   * @delete PackingSize
   * @param PackingSizeDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'PackingSize')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: PackingSize, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<PackingSize> {
    this.loggerService.log(`Delete PackingSize/ ${LoggerMessages.API_CALLED}`);
    return this.packingSizeService.delete(id);
  }
  /**
   *
   * @get packing size Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Packing Size')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Packing Size Schema',
    type: PackingSize,
  })
  getpackingSizeSchema() {
    this.loggerService.log(
      `GET Packing Size Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.packingSizeService.getSchema();
  }
}
