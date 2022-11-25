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
import { WheatSamplingService } from './wheatSampling.service';
import { WheatSampling } from './wheatSampling.schema';

@Controller('wheatSampling')
@ApiTags('wheatSampling')
export class WheatSamplingController {
  constructor(
    private wheatSamplingService: WheatSamplingService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('WheatSampling controller');
  }
  /**
   *
   * @get WheatSampling
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'WheatSampling')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get WheatSampling',
    type: WheatSampling,
  })
  getWheatSampling(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<WheatSampling[]> {
    this.loggerService.log(`GET WheatSampling/ ${LoggerMessages.API_CALLED}`);
    return this.wheatSamplingService.getWheatSampling(pageOptionsDto);
  }
  /**
   *
   * @get WheatSampling by id
   * @param id
   * @return
   *
   */
  @Get('byid/:id')
  @Auth(Action.Read, 'WheatSampling')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get WheatSampling By Id',
    type: WheatSampling,
  })
  async getWheatSamplingById(
    @Param('id') id: string,
  ): Promise<WheatSampling[]> {
    this.loggerService.log(
      `GET WheatSampling By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.wheatSamplingService.findById(id);
  }

  /**
   *
   * @create WheatSampling
   * @param WheatSampling
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'WheatSampling')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: WheatSampling, description: 'Successfully Created' })
  async create(
    @Body() wheatSamplingDta: WheatSampling,
  ): Promise<WheatSampling> {
    this.loggerService.log(`Post WheatSampling/ ${LoggerMessages.API_CALLED}`);
    return await this.wheatSamplingService.create(wheatSamplingDta);
  }

  /**
   *
   * @update WheatSampling
   * @param wheatSamplingDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'WheatSampling')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: WheatSampling, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() wheatSamplingDto: Partial<WheatSampling>,
  ): Promise<WheatSampling> {
    this.loggerService.log(`Patch WheatSampling/ ${LoggerMessages.API_CALLED}`);
    return await this.wheatSamplingService.update(id, wheatSamplingDto);
  }

  /**
   *
   * @delete WheatSampling
   * @param WheatSamplingDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'WheatSampling')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: WheatSampling, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<WheatSampling> {
    this.loggerService.log(
      `Delete WheatSampling/ ${LoggerMessages.API_CALLED}`,
    );
    return this.wheatSamplingService.delete(id);
  }

  /**
   *
   * @get WheatSampling Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'WheatSampling')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get WheatSampling Schema',
    type: WheatSampling,
  })
  getcontractorSchema() {
    this.loggerService.log(
      `GET WheatSampling Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.wheatSamplingService.getSchema();
  }
}
