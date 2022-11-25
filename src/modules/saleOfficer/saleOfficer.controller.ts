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
import { SaleOfficerService } from './saleOfficer.service';
import { SaleOfficer } from './saleOfficer.schema';
import { SaleOfficerDtoDto } from './dto/saleOfficerDto.dto';

@Controller('saleOfficer')
@ApiTags('saleOfficer')
export class SaleOfficerController {
  constructor(
    private saleOfficerService: SaleOfficerService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('SaleOfficer controller');
  }

  /**
   *
   * @get SaleOfficer
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'SaleOfficer')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get SaleOfficer',
    type: SaleOfficer,
  })
  getSaleOfficer(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<SaleOfficer[]> {
    this.loggerService.log(`GET SaleOfficer/ ${LoggerMessages.API_CALLED}`);
    return this.saleOfficerService.getSaleOfficer(pageOptionsDto);
  }
  /**
   *
   * @get SaleOfficer by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'SaleOfficer')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get SaleOfficer By Id',
    type: SaleOfficer,
  })
  async getSaleOfficerById(@Param('id') id: string): Promise<SaleOfficer[]> {
    this.loggerService.log(
      `GET SaleOfficer By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.saleOfficerService.findById(id);
  }

  /**
   *
   * @create SaleOfficer
   * @param saleOfficer
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'SaleOfficer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: SaleOfficer, description: 'Successfully Created' })
  async create(@Body() saleOfficer: SaleOfficer): Promise<SaleOfficer> {
    this.loggerService.log(`Post SaleOfficer/ ${LoggerMessages.API_CALLED}`);
    return await this.saleOfficerService.create(saleOfficer);
  }

  /**
   *
   * @update SaleOfficer
   * @param saleOfficerDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'SaleOfficer')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: SaleOfficer, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() saleOfficerDto: SaleOfficerDtoDto,
  ): Promise<SaleOfficer> {
    this.loggerService.log(`Patch SaleOfficer/ ${LoggerMessages.API_CALLED}`);
    return await this.saleOfficerService.update(id, saleOfficerDto);
  }

  /**
   *
   * @delete SaleOfficer
   * @param SaleOfficerDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'SaleOfficer')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: SaleOfficer, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<SaleOfficer> {
    this.loggerService.log(`Delete SaleOfficer/ ${LoggerMessages.API_CALLED}`);
    return this.saleOfficerService.delete(id);
  }
  /**
   *
   * @get sale Officer Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Sale Officer')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Sale Officer Schema',
    type: SaleOfficer,
  })
  getsaleOfficerSchema() {
    this.loggerService.log(
      `GET Sale Officer Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.saleOfficerService.getSchema();
  }
}
