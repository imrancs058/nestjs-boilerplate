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
import { FarmAddressService } from './farm_address.service';
import { Farm_Address } from './farm_address.schema';
import { Farm_AddressDto } from './dto/farm_address.dto';

@Controller('farm_address')
@ApiTags('farm_Address')
export class FarmAddressController {
  constructor(
    private farmaAddressService: FarmAddressService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('farm_address controller');
  }

  /**
   *
   * @get farm_address
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Farm_Address')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Farm Address',
    type: Farm_Address,
  })
  getFarm_Address(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Farm_Address[]> {
    this.loggerService.log(`GET Farm_Address/ ${LoggerMessages.API_CALLED}`);
    return this.farmaAddressService.getFarm_Address(pageOptionsDto);
  }
  /**
   *
   * @get farm_address by id
   * @param id
   * @return
   *
   */
  @Get('byid/:id')
  @Auth(Action.Read, 'Farm_Address')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Farm_Address By Id',
    type: Farm_Address,
  })
  async getFarmAddressById(@Param('id') id: string): Promise<Farm_Address[]> {
    this.loggerService.log(
      `GET Farm_Address By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.farmaAddressService.findById(id);
  }

  /**
   *
   * @create farm_address
   * @param farm_AddressDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Farm_Address')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Farm_Address, description: 'Successfully Created' })
  async create(@Body() farm_AddressDto: Farm_Address[]): Promise<Farm_Address> {
    this.loggerService.log(`Post Farm_Address/ ${LoggerMessages.API_CALLED}`);
    return await this.farmaAddressService.create(farm_AddressDto);
  }

  /**
   *
   * @update farm_address
   * @param farm_addressDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Farm_Address')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Farm_Address, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() farm_AdddressDto: Farm_AddressDto,
  ): Promise<Farm_Address> {
    this.loggerService.log(`Patch Farm_Address/ ${LoggerMessages.API_CALLED}`);
    return await this.farmaAddressService.update(id, farm_AdddressDto);
  }

  /**
   *
   * @delete farm_address
   * @param farm_AddressDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Farm_Address')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Farm_Address, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Farm_Address> {
    this.loggerService.log(`Delete Farm_Address/ ${LoggerMessages.API_CALLED}`);
    return this.farmaAddressService.delete(id);
  }

  /**
   *
   * @get Farm_Address Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Farm_Address')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Farm_Address Schema',
    type: Farm_Address,
  })
  getfarm_addressSchema() {
    this.loggerService.log(
      `GET Farm_Address Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.farmaAddressService.getSchema();
  }
}
