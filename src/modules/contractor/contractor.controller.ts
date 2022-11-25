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
import { Contractor } from './contractor.schema';
import { ContractorService } from './contractor.service';

@Controller('contractor')
@ApiTags('contractors')
export class ContractorController {
  constructor(
    private contractorService: ContractorService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('contractor controller');
  }

  /**
   *
   * @get contractor
   * @param contractorDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Contractor')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Contractor',
    type: Contractor,
  })
  getContractor(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Contractor[]> {
    this.loggerService.log(`GET Contractor/ ${LoggerMessages.API_CALLED}`);
    return this.contractorService.getContractor(pageOptionsDto);
  }
  /**
   *
   * @get contractor by id
   * @param id
   * @return
   *
   */
  @Get('byid/:id')
  @Auth(Action.Read, 'Contractor')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Contractor By Id',
    type: Contractor,
  })
  async getContractorById(@Param('id') id: string): Promise<Contractor[]> {
    this.loggerService.log(
      `GET Contractor By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.contractorService.findById(id);
  }

  /**
   *
   * @create contractor
   * @param contractorDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Contractor')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Contractor, description: 'Successfully Created' })
  async create(@Body() contractorDto: Contractor): Promise<Contractor> {
    this.loggerService.log(`Post Contractor/ ${LoggerMessages.API_CALLED}`);
    return await this.contractorService.create(contractorDto);
  }

  /**
   *
   * @update contractor
   * @param contractorDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Contractor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Contractor, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() contractorDto: Partial<Contractor>,
  ): Promise<Contractor> {
    this.loggerService.log(`Patch Contractor/ ${LoggerMessages.API_CALLED}`);
    return await this.contractorService.update(id, contractorDto);
  }

  /**
   *
   * @delete contractor
   * @param contractorDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Contractor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Contractor, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Contractor> {
    this.loggerService.log(`Delete Contractor/ ${LoggerMessages.API_CALLED}`);
    return this.contractorService.delete(id);
  }

  /**
   *
   * @get Contractor Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Contractor')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Contractor Schema',
    type: Contractor,
  })
  getcontractorSchema() {
    this.loggerService.log(
      `GET Contractor Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.contractorService.getSchema();
  }
}
