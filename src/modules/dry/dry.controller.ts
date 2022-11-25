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
import { DryService } from './dry.service';
import { Dry } from './dry.schema';
import { DryDtoDto } from './dto/dryDto.dto';

@Controller('dry')
@ApiTags('dry')
export class DryController {
  constructor(
    private dryService: DryService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Dry controller');
  }

  /**
   *
   * @get Dry
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Dry')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Dry',
    type: Dry,
  })
  getDry(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Dry[]> {
    this.loggerService.log(`GET Dry/ ${LoggerMessages.API_CALLED}`);
    return this.dryService.getDry(pageOptionsDto);
  }
  /**
   *
   * @get Dry by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'Dry')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Dry By Id',
    type: Dry,
  })
  async getDryById(@Param('id') id: string): Promise<Dry[]> {
    this.loggerService.log(`GET Dry By Id/ ${LoggerMessages.API_CALLED}`);
    return this.dryService.findById(id);
  }

  /**
   *
   * @create Dry
   * @param dryData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Dry')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Dry, description: 'Successfully Created' })
  async create(@Body() dryData: Dry): Promise<Dry> {
    this.loggerService.log(`Post Dry/ ${LoggerMessages.API_CALLED}`);
    return await this.dryService.create(dryData, '', '');
  }

  /**
   *
   * @update Dry
   * @param dryDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Dry')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Dry, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() dryDto: DryDtoDto,
  ): Promise<Dry> {
    this.loggerService.log(`Patch Dry/ ${LoggerMessages.API_CALLED}`);
    return await this.dryService.update(id, dryDto);
  }

  /**
   *
   * @delete Dry
   * @param DryDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Dry')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Dry, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Dry> {
    this.loggerService.log(`Delete Dry/ ${LoggerMessages.API_CALLED}`);
    return this.dryService.delete(id);
  }
  /**
   *
   * @get Dry Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Dry')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Dry Schema',
    type: Dry,
  })
  getdrySchema() {
    this.loggerService.log(`GET Dry Schema/ ${LoggerMessages.API_CALLED}`);
    return this.dryService.getSchema();
  }
}
