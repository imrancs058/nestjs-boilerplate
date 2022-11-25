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
import { attendanceService } from './attendance.service';
import { attendance } from './attendance.schema';
import { attendanceDtoDto } from './dto/attendance.dto';

@Controller('attendance')
@ApiTags('attendance')
export class attendanceController {
  constructor(
    private attendanceService: attendanceService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('attendance controller');
  }

  /**
   *
   * @get attendance
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'attendance')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get attendance',
    type: attendance,
  })
  getattendance(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<attendance[]> {
    this.loggerService.log(`GET attendance/ ${LoggerMessages.API_CALLED}`);
    return this.attendanceService.getattendance(pageOptionsDto);
  }
  /**
   *
   * @get attendance by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'attendance')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get attendance By Id',
    type: attendance,
  })
  async getattendanceById(@Param('id') id: string): Promise<attendance[]> {
    this.loggerService.log(
      `GET attendance By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.attendanceService.findById(id);
  }

  /**
   *
   * @create attendance
   * @param attendanceDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'attendance')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: attendance, description: 'Successfully Created' })
  async create(@Body() attendance: attendance): Promise<attendance> {
    this.loggerService.log(`Post attendance/ ${LoggerMessages.API_CALLED}`);
    return await this.attendanceService.create(attendance);
  }

  /**
   *
   * @update attendance
   * @param attendanceDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'attendance')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: attendance, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() attendanceDto: attendanceDtoDto,
  ): Promise<attendance> {
    this.loggerService.log(`Patch attendance/ ${LoggerMessages.API_CALLED}`);
    return await this.attendanceService.update(id, attendanceDto);
  }

  /**
   *
   * @delete attendance
   * @param attendanceDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'attendance')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: attendance, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<attendance> {
    this.loggerService.log(`Delete attendance/ ${LoggerMessages.API_CALLED}`);
    return this.attendanceService.delete(id);
  }
  /**
   *
   * @get rate List Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Rate List')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Rate List Schema',
    type: attendance,
  })
  getattendanceSchema() {
    this.loggerService.log(
      `GET Rate List Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.attendanceService.getSchema();
  }
}
