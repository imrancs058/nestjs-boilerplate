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
} from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse, Auth } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { CarriageRateService } from './carriage-rate.service';
import { Carriage_Rate } from './carriage-rate.schema';

@Controller('carriage_rate')
@ApiTags('carriage_rate')
export class CarriageRateController {
  constructor(
    private carriage_rateService: CarriageRateService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('carriage_rate controller');
  }
  /**
   *
   * @param id
   * @returns
   */
  @Get(':id')
  @Auth(Action.Read, 'Carriage_Rate')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Carriage Rate By Id',
    type: Carriage_Rate,
  })
  async findById(@Param('id') id: string): Promise<Carriage_Rate> {
    this.loggerService.log(
      `GET Carriage Rate By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.carriage_rateService.findById(id);
  }

  /**
   *
   * @create carriage Rate
   * @param carriage_RateDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Carriage_Rate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Carriage_Rate, description: 'Successfully Created' })
  async create(
    @Body() carriage_RateDto: Carriage_Rate,
  ): Promise<Carriage_Rate> {
    this.loggerService.log(`Post Carriage Rate/ ${LoggerMessages.API_CALLED}`);
    return await this.carriage_rateService.create(carriage_RateDto);
  }
  /**
   *Patch
   * @param id,carriageRateDto
   * @returns
   */
  @Patch(':id')
  @Auth(Action.Update, 'Carriage_Rate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Carriage_Rate, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() carriageRateDto: Carriage_Rate,
  ): Promise<Carriage_Rate> {
    this.loggerService.log(`Patch Carriage Rate/ ${LoggerMessages.API_CALLED}`);
    return await this.carriage_rateService.update(id, carriageRateDto);
  }

  /**
   *
   * @delete carriage rate
   * @param id
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Carriage_Rate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Carriage_Rate, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Carriage_Rate> {
    this.loggerService.log(`Delete Supplier/ ${LoggerMessages.API_CALLED}`);
    return this.carriage_rateService.delete(id);
  }
  /**
   *
   * @get CarriageRate Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Carriage_Rate')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Carriage_Rate Schema',
    type: Carriage_Rate,
  })
  getcarriageRateSchema() {
    this.loggerService.log(
      `GET Carriage_Rate Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.carriage_rateService.getSchema();
  }
}
