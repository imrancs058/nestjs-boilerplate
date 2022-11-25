/* eslint-disable prettier/prettier */
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
import { salaryTypeService } from './salaryType.service';
import { salaryType } from './salaryType.schema';
import { salaryTypeDto } from './dto/salaryType.dto';

@Controller('salaryType')
@ApiTags('salaryType')
export class salaryTypeController {
  constructor(
    private salaryTypeService: salaryTypeService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('salaryType controller');
  }

  /**
   *
   * @get salaryType
   * @param pageOptionsDto
   * @return
   *
   */
  @Get()
  @Auth(Action.Read, 'salaryType')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get salaryType',
    type: salaryType,
  })
  getsalaryType(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<salaryType[]> {
    this.loggerService.log(`GET salaryType/ ${LoggerMessages.API_CALLED}`);
    return this.salaryTypeService.getsalaryType(pageOptionsDto);
  }
  /**
   *
   * @get salaryType by id
   * @param id
   * @return
   *
   */

  @Get(':id')
  @Auth(Action.Read, 'salaryType')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get salaryType By Id',
    type: salaryType,
  })
  async getsalaryTypeById(@Param('id') id: string): Promise<salaryType[]> {
    this.loggerService.log(`GET salaryType By Id/ ${LoggerMessages.API_CALLED}`);
    return this.salaryTypeService.findById(id);
  }

  /**
   *
   * @create salaryType
   * @param salaryTypeData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'salaryType')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: salaryType, description: 'Successfully Created' })
  async create(@Body() salaryTypeData: salaryType): Promise<salaryType> {
    this.loggerService.log(`Post salaryType/ ${LoggerMessages.API_CALLED}`);
    return await this.salaryTypeService.create(salaryTypeData);
  }

  /**
   *
   * @update salaryType
   * @param salaryTypeDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'salaryType')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: salaryType, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() salaryTypeDto: salaryTypeDto,
  ): Promise<salaryType> {
    this.loggerService.log(`Patch salaryType/ ${LoggerMessages.API_CALLED}`);
    return await this.salaryTypeService.update(id, salaryTypeDto);
  }

  /**
   *
   * @delete salaryType
   * @param salaryTypeDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'salaryType')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: salaryType, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<salaryType> {
    this.loggerService.log(`Delete salaryType/ ${LoggerMessages.API_CALLED}`);
    return this.salaryTypeService.delete(id);
  }
  /**
   *
   * @get salaryType Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'salaryType')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get salaryType Schema',
    type: salaryType,
  })
  getsalaryTypeSchema() {
    this.loggerService.log(`GET salaryType Schema/ ${LoggerMessages.API_CALLED}`);
    return this.salaryTypeService.getSchema();
  }
}
