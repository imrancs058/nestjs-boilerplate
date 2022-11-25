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
import { DiscountService } from './discount.service';
import { Discount } from './discount.schema';
import { DiscountDto } from './dto/discount.dto';

@Controller('discount')
@ApiTags('discount')
export class DiscountController {
  constructor(
    private discountService: DiscountService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Discount controller');
  }

  /**
   *
   * @get Discount
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Discount')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Discount',
    type: Discount,
  })
  getDiscount(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Discount[]> {
    this.loggerService.log(`GET Discount/ ${LoggerMessages.API_CALLED}`);
    return this.discountService.getDiscount(pageOptionsDto);
  }
  /**
   *
   * @get Discount by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'Discount')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Discount By Id',
    type: Discount,
  })
  async getDiscountById(@Param('id') id: string): Promise<Discount[]> {
    this.loggerService.log(`GET Discount By Id/ ${LoggerMessages.API_CALLED}`);
    return this.discountService.findById(id);
  }

  /**
   *
   * @create Discount
   * @param discountData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Discount')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Discount, description: 'Successfully Created' })
  async create(@Body() discountData: Discount): Promise<Discount> {
    this.loggerService.log(`Post Discount/ ${LoggerMessages.API_CALLED}`);
    return await this.discountService.create(discountData);
  }

  /**
   *
   * @update Discount
   * @param discountDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Discount')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Discount, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() discountDto: DiscountDto,
  ): Promise<Discount> {
    this.loggerService.log(`Patch Discount/ ${LoggerMessages.API_CALLED}`);
    return await this.discountService.update(id, discountDto);
  }

  /**
   *
   * @delete Discount
   * @param DiscountDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Discount')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Discount, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Discount> {
    this.loggerService.log(`Delete Discount/ ${LoggerMessages.API_CALLED}`);
    return this.discountService.delete(id);
  }
  /**
   *
   * @get Discount Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Discount')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Discount Schema',
    type: Discount,
  })
  getdiscountSchema() {
    this.loggerService.log(`GET Discount Schema/ ${LoggerMessages.API_CALLED}`);
    return this.discountService.getSchema();
  }
}
