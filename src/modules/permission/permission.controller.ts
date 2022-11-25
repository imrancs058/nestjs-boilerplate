import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiPageOkResponse, Auth } from 'src/decorators';
import { LoggerService } from 'src/logger/logger.service';
import { PermissionService } from './permission.service';
import { Action } from '../../casl/userRoles';
import { Permission } from './permission.schema';
import { LoggerMessages } from 'src/exceptions';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

@Controller('permission')
export class PermissionController {
  constructor(
    private permissionService: PermissionService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('permission controller');
  }
  /**
   *
   * @create Permission
   * @param PermissionDto
   * @return
   *
   */
  // @Post()
  // @Auth(Action.Create, 'Permission')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOkResponse({ type: Permission, description: 'Successfully Created' })
  // async create(@Body() PermissionDto: Permission): Promise<Permission> {
  //   this.loggerService.log(`Post Permission/ ${LoggerMessages.API_CALLED}`);
  //   return await this.permissionService.create(PermissionDto);
  // }

  /**
   *
   * @get permission
   * @param permissionDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'permission')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get permission',
    type: Permission,
  })
  getPermission(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Permission[]> {
    this.loggerService.log(`GET permission/ ${LoggerMessages.API_CALLED}`);
    return this.permissionService.getPermission(pageOptionsDto);
  }
  /**
   *
   * @get permission by id
   * @param id
   * @return
   *
   */
  @Get('/byid/:id')
  @Auth(Action.Read, 'permission')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get permission By Id',
    type: Permission,
  })
  async getpermissionById(@Param('id') id: string): Promise<Permission[]> {
    this.loggerService.log(
      `GET permission By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.permissionService.findById(id);
  }

  /**
   *
   * @update permission
   * @param permissionDto
   * @return
   *
   */
  @Patch(':id')
  //@Auth(Action.Update, 'permission')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Permission, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() permissionDto: Partial<Permission>,
  ): Promise<Permission> {
    this.loggerService.log(`Patch permission/ ${LoggerMessages.API_CALLED}`);
    return await this.permissionService.update(id, permissionDto);
  }

  /**
   *
   * @delete permission
   * @param permissionDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'permission')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Permission, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Permission> {
    this.loggerService.log(`Delete permission/ ${LoggerMessages.API_CALLED}`);
    return this.permissionService.delete(id);
  }
}
