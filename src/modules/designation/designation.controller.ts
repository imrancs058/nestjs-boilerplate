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
import { designationService } from './designation.service';
import { designation } from './designation.schema';
import { designationDtoDto } from './dto/designationDto.dto';

@Controller('designation')
@ApiTags('designation')
export class designationController {
  constructor(
    private designationService: designationService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('designation controller');
  }

  /**
   *
   * @get designation
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'designation')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get designation',
    type: designation,
  })
  getdesignation(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<designation[]> {
    this.loggerService.log(`GET designation/ ${LoggerMessages.API_CALLED}`);
    return this.designationService.getdesignation(pageOptionsDto);
  }
  /**
   *
   * @get designation by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'designation')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get designation By Id',
    type: designation,
  })
  async getdesignationById(@Param('id') id: string): Promise<designation[]> {
    this.loggerService.log(`GET designation By Id/ ${LoggerMessages.API_CALLED}`);
    return this.designationService.findById(id);
  }

  /**
   *
   * @create designation
   * @param designationData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'designation')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: designation, description: 'Successfully Created' })
  async create(@Body() designationData: designation): Promise<designation> {
    this.loggerService.log(`Post designation/ ${LoggerMessages.API_CALLED}`);
    return await this.designationService.create(designationData);
  }

  /**
   *
   * @update designation
   * @param designationDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'designation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: designation, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() designationDto: designationDtoDto,
  ): Promise<designation> {
    this.loggerService.log(`Patch designation/ ${LoggerMessages.API_CALLED}`);
    return await this.designationService.update(id, designationDto);
  }

  /**
   *
   * @delete designation
   * @param designationDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'designation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: designation, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<designation> {
    this.loggerService.log(`Delete designation/ ${LoggerMessages.API_CALLED}`);
    return this.designationService.delete(id);
  }
  /**
   *
   * @get designation Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'designation')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get designation Schema',
    type: designation,
  })
  getdesignationSchema() {
    this.loggerService.log(`GET designation Schema/ ${LoggerMessages.API_CALLED}`);
    return this.designationService.getSchema();
  }
}
