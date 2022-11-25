/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  // eslint-disable-next-line prettier/prettier
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
import { LabourTypeService } from './labourType.service';
import { LabourType } from './labourType.schema';

@Controller('labourType')
@ApiTags('labourType')
export class LabourTypeController {
  constructor(
    private labourTypeService: LabourTypeService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('labourType controller');
  }

  /**
   *
   * @get labourType
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'labourType')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get labourType',
    type: LabourType,
  })
  getlabourType(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<LabourType[]> {
    this.loggerService.log(`GET labourType/ ${LoggerMessages.API_CALLED}`);
    return this.labourTypeService.getlabourType(pageOptionsDto);
  }
  /**
   *
   * @get labourType by id
   * @param id
   * @return
   *
   */

  @Get('byid:id')
  @Auth(Action.Read, 'labourType')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get labourType By Id',
    type: LabourType,
  })
  async getlabourTypeById(@Param('id') id: string): Promise<LabourType[]> {
    this.loggerService.log(
      `GET labourType By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.labourTypeService.findById(id);
  }

  /**
   *
   * @create labourType
   * @param labourTypeData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'labourType')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: LabourType, description: 'Successfully Created' })
  async create(@Body() labourTypeData: LabourType): Promise<LabourType> {
    this.loggerService.log(`Post labourType/ ${LoggerMessages.API_CALLED}`);
    return await this.labourTypeService.create(labourTypeData);
  }

  /**
   *
   * @update labourType
   * @param labourTypeDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'labourType')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: LabourType, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() labourTypeDto: Partial<LabourType>,
  ): Promise<LabourType> {
    this.loggerService.log(`Patch labourType/ ${LoggerMessages.API_CALLED}`);
    return await this.labourTypeService.update(id, labourTypeDto);
  }

  /**
   *
   * @delete labourType
   * @param labourTypeDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'labourType')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: LabourType, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<LabourType> {
    this.loggerService.log(`Delete labourType/ ${LoggerMessages.API_CALLED}`);
    return this.labourTypeService.delete(id);
  }
  /**
   *
   * @get labourType Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'labourType')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get labourType Schema',
    type: LabourType,
  })
  getlabourTypeSchema() {
    this.loggerService.log(
      `GET labourType Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.labourTypeService.getSchema();
  }
}
