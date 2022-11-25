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
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiPageOkResponse, Auth } from 'src/decorators';
import { LoggerService } from 'src/logger/logger.service';
import { CompanyService } from './company.service';
import { Action } from '../../casl/userRoles';
import { Company } from './company.schema';
import { LoggerMessages } from 'src/exceptions';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
@Controller('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Company controller');
  }
  /**
   *
   * @create Company
   * @param CompanyDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Company')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Company, description: 'Successfully Created' })
  async create(@Body() CompanyDto: Company): Promise<Company> {
    this.loggerService.log(`Post Company/ ${LoggerMessages.API_CALLED}`);
    return await this.companyService.create(CompanyDto);
  }

  /**
   *
   * @get Company
   * @param CompanyDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Company')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Company',
    type: Company,
  })
  getCompany(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Company> {
    this.loggerService.log(`GET Company/ ${LoggerMessages.API_CALLED}`);
    return this.companyService.getCompanyData(pageOptionsDto);
  }
  /**
   *
   * @get Company by id
   * @param id
   * @return
   *
   */
  @Get('/byid/:id')
  @Auth(Action.Read, 'Company')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Company By Id',
    type: Company,
  })
  async getCompanyById(@Param('id') id: string): Promise<Company[]> {
    this.loggerService.log(`GET Company By Id/ ${LoggerMessages.API_CALLED}`);
    return this.companyService.findById(id);
  }

  /**
   *
   * @update Company
   * @param CompanyDto
   * @return
   *
   */
  @Patch(':id')
  //@Auth(Action.Update, 'Company')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Company, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() CompanyDto: Partial<Company>,
  ): Promise<Company> {
    this.loggerService.log(`Patch Company/ ${LoggerMessages.API_CALLED}`);
    return await this.companyService.update(id, CompanyDto);
  }

  /**
   *
   * @delete Company
   * @param CompanyDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Company')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Company, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Company> {
    this.loggerService.log(`Delete Company/ ${LoggerMessages.API_CALLED}`);
    return this.companyService.delete(id);
  }
  /**
   *
   * @get Company Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Role')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Company Schema',
    type: Company,
  })
  async getcompanySchema() {
    this.loggerService.log(`GET Company Schema/ ${LoggerMessages.API_CALLED}`);
    return await this.companyService.getSchema();
  }
}
