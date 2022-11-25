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
import { PackingService } from './packing.service';
import { Packing } from './packing.schema';
import { PackingDtoDto } from './dto/packingDto.dto';

@Controller('packing')
@ApiTags('packing')
export class PackingController {
  constructor(
    private packingService: PackingService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Packing controller');
  }

  /**
   *
   * @get Packing
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Packing')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Packing',
    type: Packing,
  })
  getPacking(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Packing[]> {
    this.loggerService.log(`GET Packing/ ${LoggerMessages.API_CALLED}`);
    return this.packingService.getPacking(pageOptionsDto);
  }
  /**
   *
   * @get Packing by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'Packing')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Packing By Id',
    type: Packing,
  })
  async getPackingById(@Param('id') id: string): Promise<Packing[]> {
    this.loggerService.log(`GET Packing By Id/ ${LoggerMessages.API_CALLED}`);
    return this.packingService.findById(id);
  }

  /**
   *
   * @create Packing
   * @param packingData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Packing')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Packing, description: 'Successfully Created' })
  async create(@Body() packingData: Packing): Promise<Packing> {
    this.loggerService.log(`Post Packing/ ${LoggerMessages.API_CALLED}`);
    return await this.packingService.create(packingData, '', '');
  }

  /**
   *
   * @update Packing
   * @param packingDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Packing')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Packing, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() packingDto: PackingDtoDto,
  ): Promise<Packing> {
    this.loggerService.log(`Patch Packing/ ${LoggerMessages.API_CALLED}`);
    return await this.packingService.update(id, packingDto);
  }

  /**
   *
   * @delete Packing
   * @param PackingDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Packing')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Packing, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Packing> {
    this.loggerService.log(`Delete Packing/ ${LoggerMessages.API_CALLED}`);
    return this.packingService.delete(id);
  }

  /**
   *
   * @get Packing Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Packing')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Packing Schema',
    type: Packing,
  })
  getpackingSchema() {
    this.loggerService.log(`GET Packing Schema/ ${LoggerMessages.API_CALLED}`);
    return this.packingService.getSchema();
  }
}
