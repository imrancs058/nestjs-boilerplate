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
import { CottonBudTestService } from './cottonBudTest.service';
import { CottonBudTest } from './cottonBudTest.schema';

@Controller('cottonBudTest')
@ApiTags('cottonBudTest')
export class CottonBudTestController {
  constructor(
    private cottonBudTestService: CottonBudTestService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('CottonBudTest controller');
  }

  /**
   *
   * @get CottonBudTest
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'CottonBudTest')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get CottonBudTest',
    type: CottonBudTest,
  })
  getCottonBudTest(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<CottonBudTest[]> {
    this.loggerService.log(`GET CottonBudTest/ ${LoggerMessages.API_CALLED}`);
    return this.cottonBudTestService.getCottonBudTest(pageOptionsDto);
  }
  /**
   *
   * @get CottonBudTest by id
   * @param id
   * @return
   *
   */
  @Get('byid/:id')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get CottonBudTest By Id',
    type: CottonBudTest,
  })
  async getCottonBudTestById(
    @Param('id') id: string,
  ): Promise<CottonBudTest[]> {
    this.loggerService.log(
      `GET CottonBudTest By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.cottonBudTestService.findById(id);
  }

  /**
   *
   * @create CottonBudTest
   * @param cottonBudTestData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'CottonBudTest')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: CottonBudTest, description: 'Successfully Created' })
  async create(
    @Body() cottonBudTestData: CottonBudTest,
  ): Promise<CottonBudTest> {
    this.loggerService.log(`Post CottonBudTest/ ${LoggerMessages.API_CALLED}`);
    return await this.cottonBudTestService.create(cottonBudTestData);
  }

  /**
   *
   * @update CottonBudTest
   * @param cottonBudTestDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'CottonBudTest')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: CottonBudTest, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() cottonBudTestDto: Partial<CottonBudTest>,
  ): Promise<CottonBudTest> {
    this.loggerService.log(`Patch CottonBudTest/ ${LoggerMessages.API_CALLED}`);
    return await this.cottonBudTestService.update(id, cottonBudTestDto);
  }

  /**
   *
   * @delete CottonBudTest
   * @param CottonBudTestDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'CottonBudTest')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: CottonBudTest, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<CottonBudTest> {
    this.loggerService.log(
      `Delete CottonBudTest/ ${LoggerMessages.API_CALLED}`,
    );
    return this.cottonBudTestService.delete(id);
  }

  /**
   *
   * @get Cotton Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Cotton')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Wheat Schema',
    type: CottonBudTest,
  })
  getcontractorSchema() {
    this.loggerService.log(`GET Cotton Schema/ ${LoggerMessages.API_CALLED}`);
    return this.cottonBudTestService.getSchema();
  }
}
