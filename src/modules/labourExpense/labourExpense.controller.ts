/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  // eslint-disable-next-line prettier/prettier
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
import { LabourExpenseService } from './labourExpense.service';
import { LabourExpense } from './labourExpense.schema';

@Controller('labourExpense')
@ApiTags('labourExpense')
export class LabourExpenseController {
  constructor(
    private labourExpenseService: LabourExpenseService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('labourExpense controller');
  }

  /**
   *
   * @get labourExpense
   * @param pageOptionsDto
   * @return
   *
   */
  @Get()
  @Auth(Action.Read, 'labourExpense')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get labourExpense',
    type: LabourExpense,
  })
  getlabourExpense(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<LabourExpense[]> {
    this.loggerService.log(`GET labourExpense/ ${LoggerMessages.API_CALLED}`);
    return this.labourExpenseService.getlabourExpense(pageOptionsDto);
  }
  /**
   *
   * @get labourExpense by id
   * @param id
   * @return
   *
   */

  @Get(':id')
  @Auth(Action.Read, 'labourExpense')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get labourExpense By Id',
    type: LabourExpense,
  })
  async getlabourExpenseById(
    @Param('id') id: string,
  ): Promise<LabourExpense[]> {
    this.loggerService.log(
      `GET labourExpense By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.labourExpenseService.findById(id);
  }

  /**
   *
   * @create labourExpense
   * @param labourExpenseData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'labourExpense')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: LabourExpense, description: 'Successfully Created' })
  async create(
    @Body() labourExpenseData: LabourExpense,
  ): Promise<LabourExpense> {
    this.loggerService.log(`Post labourExpense/ ${LoggerMessages.API_CALLED}`);
    return await this.labourExpenseService.create(labourExpenseData);
  }

  /**
   *
   * @update labourExpense
   * @param labourExpenseDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'labourExpense')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: LabourExpense, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() labourExpenseDto: LabourExpense,
  ): Promise<LabourExpense> {
    this.loggerService.log(`Patch labourExpense/ ${LoggerMessages.API_CALLED}`);
    return await this.labourExpenseService.update(id, labourExpenseDto);
  }

  /**
   *
   * @delete labourExpense
   * @param labourExpenseDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'labourExpense')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: LabourExpense, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<LabourExpense> {
    this.loggerService.log(
      `Delete labourExpense/ ${LoggerMessages.API_CALLED}`,
    );
    return this.labourExpenseService.delete(id);
  }
  /**
   *
   * @get labourExpense Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'labourExpense')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get labourExpense Schema',
    type: LabourExpense,
  })
  getlabourExpenseSchema() {
    this.loggerService.log(
      `GET labourExpense Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.labourExpenseService.getSchema();
  }
}
