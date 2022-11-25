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
import { salaryGenerateService } from './salaryGenerate.service';
import { salaryGenerate } from './salaryGenerate.schema';
import { salaryGenerateDto } from './dto/salaryGenerate.dto';

@Controller('salaryGenerate')
@ApiTags('salaryGenerate')
export class salaryGenerateController {
  constructor(
    private salaryGenerateService: salaryGenerateService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('salaryGenerate controller');
  }

  /**
   *
   * @get salaryGenerate
   * @param pageOptionsDto
   * @return
   *
   */
  @Get()
  @Auth(Action.Read, 'salaryGenerate')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get salaryGenerate',
    type: salaryGenerate,
  })
  getsalaryGenerate(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<salaryGenerate[]> {
    this.loggerService.log(`GET salaryGenerate/ ${LoggerMessages.API_CALLED}`);
    return this.salaryGenerateService.getsalaryGenerate(pageOptionsDto);
  }
  /**
   *
   * @get salaryGenerate by id
   * @param id
   * @return
   *
   */
  @Get(':id')
  @Auth(Action.Read, 'salaryGenerate')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get salaryGenerate By Id',
    type: salaryGenerate,
  })
  async getsalaryGenerateById(
    @Param('id') id: string,
  ): Promise<salaryGenerate[]> {
    this.loggerService.log(
      `GET salaryGenerate By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.salaryGenerateService.findById(id);
  }

  /**
   *
   * @create salaryGenerate
   * @param salaryGenerateDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'salaryGenerate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: salaryGenerate, description: 'Successfully Created' })
  async create(
    @Body() salaryGenerateDto: salaryGenerateDto,
  ): Promise<salaryGenerate> {
    this.loggerService.log(`Post salaryGenerate/ ${LoggerMessages.API_CALLED}`);
    return await this.salaryGenerateService.create(salaryGenerateDto);
  }

  /**
   *
   * @update salaryGenerate
   * @param salaryGenerateDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'salaryGenerate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: salaryGenerate, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() salaryGenerateDto: salaryGenerateDto,
  ): Promise<salaryGenerate> {
    this.loggerService.log(
      `Patch salaryGenerate/ ${LoggerMessages.API_CALLED}`,
    );
    return await this.salaryGenerateService.update(id, salaryGenerateDto);
  }

  /**
   *
   * @delete salaryGenerate
   * @param salaryGenerateDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'salaryGenerate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: salaryGenerate, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<salaryGenerate> {
    this.loggerService.log(
      `Delete salaryGenerate/ ${LoggerMessages.API_CALLED}`,
    );
    return this.salaryGenerateService.delete(id);
  }

  /**
   *
   * @get salaryGenerate Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'salaryGenerate')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get salaryGenerate Schema',
    type: salaryGenerate,
  })
  getsalaryGenerateSchema() {
    this.loggerService.log(
      `GET salaryGenerate Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.salaryGenerateService.getSchema();
  }
}
