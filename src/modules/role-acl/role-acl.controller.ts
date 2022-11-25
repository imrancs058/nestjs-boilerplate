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
import { RoleAclService } from './role-acl.service';
import { Action } from '../../casl/userRoles';
import { RoleAcl } from './role-acl.schema';
import { LoggerMessages } from 'src/exceptions';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
@Controller('role-acl')
export class RoleAclController {
  constructor(
    private roleAclService: RoleAclService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('contractor_rate controller');
  }
  /**
   *
   * @create contractor Rate
   * @param contractor_rateDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Contractor_Rate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: RoleAcl, description: 'Successfully Created' })
  async create(
    @Body() contractor_rateDto: { permissionPost: string; name: string },
  ): Promise<RoleAcl> {
    console.log(contractor_rateDto);
    this.loggerService.log(`Post Contractor/ ${LoggerMessages.API_CALLED}`);
    return await this.roleAclService.create(contractor_rateDto);
  }

  /**
   *
   * @get role
   * @param roleDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Role')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Role',
    type: RoleAcl,
  })
  getRole(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<RoleAcl[]> {
    this.loggerService.log(`GET Role/ ${LoggerMessages.API_CALLED}`);
    return this.roleAclService.getRole(pageOptionsDto);
  }
  /**
   *
   * @get role by id
   * @param id
   * @return
   *
   */
  @Get('/byid/:id')
  @Auth(Action.Read, 'Role')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Role By Id',
    type: RoleAcl,
  })
  async getRoleById(@Param('id') id: string): Promise<RoleAcl[]> {
    this.loggerService.log(`GET Role By Id/ ${LoggerMessages.API_CALLED}`);
    return this.roleAclService.findById(id);
  }

  /**
   *
   * @update role
   * @param roleDto
   * @return
   *
   */
  @Patch(':id')
  //@Auth(Action.Update, 'Role')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: RoleAcl, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() roleDto: { permissionPost: string; name: string },
  ): Promise<RoleAcl> {
    this.loggerService.log(`Patch Role/ ${LoggerMessages.API_CALLED}`);
    return await this.roleAclService.update(id, roleDto);
  }

  /**
   *
   * @delete role
   * @param roleDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Role')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: RoleAcl, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<RoleAcl> {
    this.loggerService.log(`Delete Role/ ${LoggerMessages.API_CALLED}`);
    return this.roleAclService.delete(id);
  }
  /**
   *
   * @get role
   * @param roleDto
   * @return
   *
   */
  @Get('resourcelist')
  @Auth(Action.Read, 'Role')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Role',
    type: RoleAcl,
  })
  getResourceList() {
    this.loggerService.log(`GET ResourceList/ ${LoggerMessages.API_CALLED}`);
    return this.roleAclService.getResourceList();
  }

  /**
   *
   * @get role by id
   * @param id
   * @return
   *
   */
  @Get('/idwithPermission/:id')
  @Auth(Action.Read, 'Role')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Role By Id',
    type: RoleAcl,
  })
  async getRoleByIdWithPermissions(
    @Param('id') id: string,
  ): Promise<RoleAcl[]> {
    this.loggerService.log(`GET Role By Id/ ${LoggerMessages.API_CALLED}`);
    return this.roleAclService.findByIdWithPermission(id);
  }

  /**
   *
   * @get Role-acl Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Role')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Role-acl Schema',
    type: RoleAcl,
  })
  async getbookSchema() {
    this.loggerService.log(`GET Role-acl Schema/ ${LoggerMessages.API_CALLED}`);
    return await this.roleAclService.getSchema();
  }
}
