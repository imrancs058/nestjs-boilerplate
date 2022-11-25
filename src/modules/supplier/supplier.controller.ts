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
import { LoggerMessages } from '../../exceptions';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse, Auth } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { SupplierService } from './supplier.service';
import { Supplier, SupplierSchema } from './supplier.schema';

@Controller('supplier')
@ApiTags('suppliers')
export class SupplierController {
  constructor(
    private supplierService: SupplierService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('supplier controller');
  }
  /**
   *
   * @get supplier
   * @param supplierDto
   * @return
   *
   */
  @Get('/list')
  @Auth(Action.Read, 'Supplier')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Supplier',
    type: Supplier,
  })
  getSupplier(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Supplier[]> {
    this.loggerService.log(`GET Supplier/ ${LoggerMessages.API_CALLED}`);
    console.log(SupplierSchema);
    return this.supplierService.getSupplier(pageOptionsDto);
  }
  /**
   *
   * @get supplier by id
   * @param id
   * @return
   *
   */
  @Get('/byid/:id')
  @Auth(Action.Read, 'Supplier')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Supplier By Id',
    type: Supplier,
  })
  async getSupplierById(@Param('id') id: string): Promise<Supplier[]> {
    this.loggerService.log(`GET Supplier By Id/ ${LoggerMessages.API_CALLED}`);
    return this.supplierService.findById(id);
  }

  /**
   *
   * @create supplier
   * @param supplierDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Supplier')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Supplier, description: 'Successfully Created' })
  async create(@Body() supplierDto: Supplier): Promise<Supplier> {
    this.loggerService.log(`Post Supplier/ ${LoggerMessages.API_CALLED}`);
    return await this.supplierService.create(supplierDto);
  }

  /**
   *
   * @update supplier
   * @param supplierDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Supplier')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Supplier, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() supplierDto: Partial<Supplier>,
  ): Promise<Supplier> {
    this.loggerService.log(`Patch Supplier/ ${LoggerMessages.API_CALLED}`);
    return await this.supplierService.update(id, supplierDto);
  }

  /**
   *
   * @delete supplier
   * @param supplierDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Supplier')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Supplier, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Supplier> {
    this.loggerService.log(`Delete Supplier/ ${LoggerMessages.API_CALLED}`);
    return this.supplierService.delete(id);
  }

  /**
   *
   * @get Supplier Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Supplier')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Supplier Schema',
    type: Supplier,
  })
  getsupplierSchema() {
    this.loggerService.log(`GET Supplier Schema/ ${LoggerMessages.API_CALLED}`);
    return this.supplierService.getSchema();
  }
}
