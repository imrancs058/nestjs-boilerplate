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
import { employeeService } from './employee.service';
import { employee } from './employee.schema';
import { employeeDtoDto } from './dto/employeeDto.dto';

@Controller('employee')
@ApiTags('employee')
export class employeeController {
  constructor(
    private employeeService: employeeService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('employee controller');
  }

  /**
   *
   * @get employee
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'employee')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get employee',
    type: employee,
  })
  getemployee(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<employee[]> {
    this.loggerService.log(`GET employee/ ${LoggerMessages.API_CALLED}`);
    return this.employeeService.getemployee(pageOptionsDto);
  }
  /**
   *
   * @get employee by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'employee')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get employee By Id',
    type: employee,
  })
  async getemployeeById(@Param('id') id: string): Promise<employee[]> {
    this.loggerService.log(`GET employee By Id/ ${LoggerMessages.API_CALLED}`);
    return this.employeeService.findById(id);
  }

  /**
   *
   * @create employee
   * @param employeeData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'employee')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: employee, description: 'Successfully Created' })
  async create(@Body() employeeData: employee): Promise<employee> {
    this.loggerService.log(`Post employee/ ${LoggerMessages.API_CALLED}`);
    return await this.employeeService.create(employeeData);
  }

  /**
   *
   * @update employee
   * @param employeeDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'employee')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: employee, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() employeeDto: employeeDtoDto,
  ): Promise<employee> {
    this.loggerService.log(`Patch employee/ ${LoggerMessages.API_CALLED}`);
    return await this.employeeService.update(id, employeeDto);
  }

  /**
   *
   * @delete employee
   * @param employeeDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'employee')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: employee, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<employee> {
    this.loggerService.log(`Delete employee/ ${LoggerMessages.API_CALLED}`);
    return this.employeeService.delete(id);
  }
  /**
   *
   * @get employee Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'employee')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get employee Schema',
    type: employee,
  })
  getemployeeSchema() {
    this.loggerService.log(`GET employee Schema/ ${LoggerMessages.API_CALLED}`);
    return this.employeeService.getSchema();
  }
}
