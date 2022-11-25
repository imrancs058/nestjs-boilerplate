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
import { CottonSamplingService } from './cottonSampling.service';
import { CottonSampling } from './cottonSampling.schema';

@Controller('cottonSampling')
@ApiTags('cottonSampling')
export class CottonSamplingController {
  constructor(
    private cottonSamplingService: CottonSamplingService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('CottonSampling controller');
  }
  /**
   *
   * @get CottonSampling
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'CottonSampling')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get CottonSampling',
    type: CottonSampling,
  })
  getCottonSampling(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<CottonSampling[]> {
    this.loggerService.log(`GET CottonSampling/ ${LoggerMessages.API_CALLED}`);
    return this.cottonSamplingService.getCottonSampling(pageOptionsDto);
  }
  /**
   *
   * @get CottonSampling by id
   * @param id
   * @return
   *
   */
  @Get('byid/:id')
  @Auth(Action.Read, 'CottonSampling')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get CottonSampling By Id',
    type: CottonSampling,
  })
  async getCottonSamplingById(
    @Param('id') id: string,
  ): Promise<CottonSampling[]> {
    this.loggerService.log(
      `GET CottonSampling By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.cottonSamplingService.findById(id);
  }

  /**
   *
   * @create CottonSampling
   * @param CottonSampling
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'CottonSampling')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: CottonSampling, description: 'Successfully Created' })
  async create(
    @Body() cottonSamplingDta: CottonSampling,
  ): Promise<CottonSampling> {
    this.loggerService.log(`Post CottonSampling/ ${LoggerMessages.API_CALLED}`);
    return await this.cottonSamplingService.create(cottonSamplingDta);
  }

  /**
   *
   * @update CottonSampling
   * @param CottonSamplingDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'CottonSampling')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: CottonSampling, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() cottonSamplingDto: Partial<CottonSampling>,
  ): Promise<CottonSampling> {
    this.loggerService.log(
      `Patch CottonSampling/ ${LoggerMessages.API_CALLED}`,
    );
    return await this.cottonSamplingService.update(id, cottonSamplingDto);
  }

  /**
   *
   * @delete CottonSampling
   * @param CottonSamplingDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'CottonSampling')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: CottonSampling, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<CottonSampling> {
    this.loggerService.log(
      `Delete CottonSampling/ ${LoggerMessages.API_CALLED}`,
    );
    return this.cottonSamplingService.delete(id);
  }

  /**
   *
   * @get CottonSampling Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'CottonSampling')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get CottonSampling Schema',
    type: CottonSampling,
  })
  getcontractorSchema() {
    this.loggerService.log(
      `GET CottonSampling Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.cottonSamplingService.getSchema();
  }
}
