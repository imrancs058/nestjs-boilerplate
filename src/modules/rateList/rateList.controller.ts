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
import { RateListService } from './rateList.service';
import { RateList } from './rateList.schema';
import { RateListDtoDto } from './dto/rateListDto.dto';

@Controller('rateList')
@ApiTags('rateList')
export class RateListController {
  constructor(
    private rateListService: RateListService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('RateList controller');
  }

  /**
   *
   * @get RateList
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'RateList')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get RateList',
    type: RateList,
  })
  getRateList(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<RateList[]> {
    this.loggerService.log(`GET RateList/ ${LoggerMessages.API_CALLED}`);
    return this.rateListService.getRateList(pageOptionsDto);
  }
  /**
   *
   * @get RateList by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'RateList')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get RateList By Id',
    type: RateList,
  })
  async getRateListById(@Param('id') id: string): Promise<RateList[]> {
    this.loggerService.log(`GET RateList By Id/ ${LoggerMessages.API_CALLED}`);
    return this.rateListService.findById(id);
  }

  /**
   *
   * @create RateList
   * @param rateListDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'RateList')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: RateList, description: 'Successfully Created' })
  async create(@Body() rateList: RateList): Promise<RateList> {
    this.loggerService.log(`Post RateList/ ${LoggerMessages.API_CALLED}`);
    return await this.rateListService.create(rateList);
  }

  /**
   *
   * @update RateList
   * @param rateListDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'RateList')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: RateList, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() rateListDto: RateListDtoDto,
  ): Promise<RateList> {
    this.loggerService.log(`Patch RateList/ ${LoggerMessages.API_CALLED}`);
    return await this.rateListService.update(id, rateListDto);
  }

  /**
   *
   * @delete RateList
   * @param RateListDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'RateList')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: RateList, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<RateList> {
    this.loggerService.log(`Delete RateList/ ${LoggerMessages.API_CALLED}`);
    return this.rateListService.delete(id);
  }
  /**
   *
   * @get rate List Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Rate List')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Rate List Schema',
    type: RateList,
  })
  getrateListSchema() {
    this.loggerService.log(
      `GET Rate List Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.rateListService.getSchema();
  }
}
