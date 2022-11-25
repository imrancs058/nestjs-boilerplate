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
import { ContractorRateService } from './contractor_rate.service';
import { Contractor_Rate } from './contractor_rate.schema';
import { Contractor_RateDto } from './dto/contractor_rate.dto';
@Controller('contractor_rate')
@ApiTags('contractor_rate')
export class ContractorRateController {
  constructor(
    private contractor_rateService: ContractorRateService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('contractor_rate controller');
  }
  /**
   *
   * @param id
   * @returns
   */
  @Get(':id')
  // @Auth(Action.Read, 'Contractor_Rate')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Contractor Rate By Id',
    type: Contractor_Rate,
  })
  async getContractorRateById(
    @Param('id') id: string,
  ): Promise<Contractor_Rate[]> {
    this.loggerService.log(
      `GET Contractor By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.contractor_rateService.findById(id);
  }

  /**
   *
   * @create contractor Rate
   * @param contractor_rateDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Contractor_Rate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Contractor_Rate, description: 'Successfully Created' })
  async create(
    @Body() contractor_rateDto: Contractor_Rate,
  ): Promise<Contractor_Rate> {
    this.loggerService.log(`Post Contractor/ ${LoggerMessages.API_CALLED}`);
    return await this.contractor_rateService.create(contractor_rateDto);
  }
  /**
   *
   * @param id
   * @param contractorRateDto
   * @returns
   */
  @Patch(':id')
  @Auth(Action.Update, 'Contractor_Rate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Contractor_Rate, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() contractorRateDto: Contractor_RateDto,
  ): Promise<Contractor_Rate> {
    this.loggerService.log(
      `Patch Contractor Rate/ ${LoggerMessages.API_CALLED}`,
    );
    return await this.contractor_rateService.update(id, contractorRateDto);
  }

  /**
   *
   * @delete contractor rate
   * @param id
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Contractor_Rate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Contractor_Rate, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Contractor_Rate> {
    this.loggerService.log(`Delete Supplier/ ${LoggerMessages.API_CALLED}`);
    return this.contractor_rateService.delete(id);
  }

  /**
   *
   * @get Contractor_Rate Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Contractor_rate')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Contractor_rate Schema',
    type: Contractor_Rate,
  })
  getcontractor_rateSchema() {
    this.loggerService.log(
      `GET Contractor_Rate Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.contractor_rateService.getSchema();
  }
}
