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
import { WheatPurityService } from './wheatPurity.service';
import { WheatPurity } from './wheatPurity.schema';

@Controller('wheatPurity')
@ApiTags('wheatPurity')
export class WheatPurityController {
  constructor(
    private wheatPurityService: WheatPurityService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('WheatPurity controller');
  }
  /**
   *
   * @get WheatPurity
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'WheatPurity')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get WheatPurity',
    type: WheatPurity,
  })
  getWheatPurity(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<WheatPurity[]> {
    this.loggerService.log(`GET WheatPurity/ ${LoggerMessages.API_CALLED}`);
    return this.wheatPurityService.getWheatPurity(pageOptionsDto);
  }
  /**
   *
   * @get WheatPurity by id
   * @param id
   * @return
   *
   */
  @Get('byid/:id')
  @Auth(Action.Read, 'WheatPurity')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get WheatPurity By Id',
    type: WheatPurity,
  })
  async getWheatPurityById(@Param('id') id: string): Promise<WheatPurity[]> {
    this.loggerService.log(
      `GET WheatPurity By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.wheatPurityService.findById(id);
  }

  /**
   *
   * @create WheatPurity
   * @param wheatPurity
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'WheatPurity')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: WheatPurity, description: 'Successfully Created' })
  async create(@Body() wheatPurityDta: WheatPurity): Promise<WheatPurity> {
    this.loggerService.log(`Post WheatPurity/ ${LoggerMessages.API_CALLED}`);
    return await this.wheatPurityService.create(wheatPurityDta);
  }

  /**
   *
   * @update WheatPurity
   * @param wheatPurityDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'WheatPurity')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: WheatPurity, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() wheatPurityDto: Partial<WheatPurity>,
  ): Promise<WheatPurity> {
    this.loggerService.log(`Patch WheatPurity/ ${LoggerMessages.API_CALLED}`);
    return await this.wheatPurityService.update(id, wheatPurityDto);
  }

  /**
   *
   * @delete WheatPurity
   * @param WheatPurityDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'WheatPurity')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: WheatPurity, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<WheatPurity> {
    this.loggerService.log(`Delete WheatPurity/ ${LoggerMessages.API_CALLED}`);
    return this.wheatPurityService.delete(id);
  }

  /**
   *
   * @get Wheat Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Wheat')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Wheat Schema',
    type: WheatPurity,
  })
  getcontractorSchema() {
    this.loggerService.log(
      `GET wheatPurity Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.wheatPurityService.getSchema();
  }
}
