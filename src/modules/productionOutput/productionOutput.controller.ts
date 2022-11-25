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
import { ProductionOutputService } from './productionOutput.service';
import { ProductionOutput } from './productionOutput.schema';
import { ProductionOutputDtoDto } from './dto/productionOutputDto.dto';

@Controller('productionOutput')
@ApiTags('productionOutput')
export class ProductionOutputController {
  constructor(
    private productionOutputService: ProductionOutputService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('ProductionOutput controller');
  }

  /**
   *
   * @get ProductionOutput
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'ProductionOutput')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get ProductionOutput',
    type: ProductionOutput,
  })
  getProductionOutput(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<ProductionOutput[]> {
    this.loggerService.log(
      `GET ProductionOutput/ ${LoggerMessages.API_CALLED}`,
    );
    return this.productionOutputService.getProductionOutput(pageOptionsDto);
  }
  /**
   *
   * @get ProductionOutput by id
   * @param id
   * @return
   *
   */
  @Get('byid/:id')
  @Auth(Action.Read, 'ProductionOutput')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get ProductionOutput By Id',
    type: ProductionOutput,
  })
  async getProductionOutputById(
    @Param('id') id: string,
  ): Promise<ProductionOutput[]> {
    this.loggerService.log(
      `GET ProductionOutput By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.productionOutputService.findById(id);
  }

  /**
   *
   * @create ProductionOutput
   * @param productionOutputDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'ProductionOutput')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: ProductionOutput,
    description: 'Successfully Created',
  })
  async create(
    @Body() productionOutput: ProductionOutput,
  ): Promise<ProductionOutput> {
    this.loggerService.log(
      `Post ProductionOutput/ ${LoggerMessages.API_CALLED}`,
    );
    return await this.productionOutputService.create(productionOutput);
  }

  /**
   *
   * @update ProductionOutput
   * @param productionOutputDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'ProductionOutput')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: ProductionOutput, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() productionOutputDto: ProductionOutputDtoDto,
  ): Promise<ProductionOutput> {
    this.loggerService.log(
      `Patch ProductionOutput/ ${LoggerMessages.API_CALLED}`,
    );
    return await this.productionOutputService.update(id, productionOutputDto);
  }

  /**
   *
   * @delete ProductionOutput
   * @param ProductionOutputDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'ProductionOutput')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: ProductionOutput, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<ProductionOutput> {
    this.loggerService.log(
      `Delete ProductionOutput/ ${LoggerMessages.API_CALLED}`,
    );
    return this.productionOutputService.delete(id);
  }
  /**
   *
   * @get Production Output Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Production Output')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Production Output Schema',
    type: ProductionOutput,
  })
  getproductionOutputSchema() {
    this.loggerService.log(
      `GET Production Output Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.productionOutputService.getSchema();
  }
}
