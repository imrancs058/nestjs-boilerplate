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
import { employeeSalarySetupService } from './employeeSalarySetup.service';
import { employeeSalarySetup } from './employeeSalarySetup.schema';
import { employeeSalarySetupDtoDto } from './dto/employeeSalarySetupDto.dto';

@Controller('employeeSalarySetup')
@ApiTags('employeeSalarySetup')
export class employeeSalarySetupController {
  constructor(
    private employeeSalarySetupService: employeeSalarySetupService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('employeeSalarySetup controller');
  }

  /**
   *
   * @get employeeSalarySetup
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'employeeSalarySetup')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get employeeSalarySetup',
    type: employeeSalarySetup,
  })
  getemployeeSalarySetup(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<employeeSalarySetup[]> {
    this.loggerService.log(
      `GET employeeSalarySetup/ ${LoggerMessages.API_CALLED}`,
    );
    return this.employeeSalarySetupService.getemployeeSalarySetup(
      pageOptionsDto,
    );
  }
  /**
   *
   * @get employeeSalarySetup by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'employeeSalarySetup')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get employeeSalarySetup By Id',
    type: employeeSalarySetup,
  })
  async getemployeeSalarySetupById(
    @Param('id') id: string,
  ): Promise<employeeSalarySetup[]> {
    this.loggerService.log(
      `GET employeeSalarySetup By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.employeeSalarySetupService.findById(id);
  }

  /**
   *
   * @create employeeSalarySetup
   * @param employeeSalarySetupData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'employeeSalarySetup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: employeeSalarySetup,
    description: 'Successfully Created',
  })
  async create(
    @Body() employeeSalarySetupData: employeeSalarySetup,
  ): Promise<employeeSalarySetup> {
    this.loggerService.log(
      `Post employeeSalarySetup/ ${LoggerMessages.API_CALLED}`,
    );
    return await this.employeeSalarySetupService.create(
      employeeSalarySetupData,
    );
  }

  /**
   *
   * @update employeeSalarySetup
   * @param employeeSalarySetupDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'employeeSalarySetup')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({
    type: employeeSalarySetup,
    description: 'Updated Sucessfully',
  })
  async update(
    @Param('id') id: string,
    @Body() employeeSalarySetupDto: employeeSalarySetupDtoDto,
  ): Promise<employeeSalarySetup> {
    this.loggerService.log(
      `Patch employeeSalarySetup/ ${LoggerMessages.API_CALLED}`,
    );
    return await this.employeeSalarySetupService.update(
      id,
      employeeSalarySetupDto,
    );
  }

  /**
   *
   * @delete employeeSalarySetup
   * @param employeeSalarySetupDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'employeeSalarySetup')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({
    type: employeeSalarySetup,
    description: 'Delete Sucessfully',
  })
  async delete(@Param('id') id: string): Promise<employeeSalarySetup> {
    this.loggerService.log(
      `Delete employeeSalarySetup/ ${LoggerMessages.API_CALLED}`,
    );
    return this.employeeSalarySetupService.delete(id);
  }

  /**
   *
   * @get employeeSalarySetup Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'employeeSalarySetup')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get employeeSalarySetup Schema',
    type: employeeSalarySetup,
  })
  getemployeeSalarySetupSchema() {
    this.loggerService.log(
      `GET employeeSalarySetup Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.employeeSalarySetupService.getSchema();
  }
}
