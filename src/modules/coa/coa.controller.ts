import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { Action } from '../../casl/userRoles';
import { ApiPageOkResponse, Auth, AuthUser } from '../../decorators';
import { LoggerService } from '../../logger/logger.service';
import { CoaService } from './coa.service';
import { COA } from './coa.schema';
import { User } from '../user/user.schema';
import { LoggerMessages } from '../../exceptions';
@Controller('coa')
export class CoaController {
  constructor(
    private coaService: CoaService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('COA controller');
  }

  @Get()
  @Auth(Action.Read, 'COA')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: COA,
  })
  coaChildByHeadCode(
    @Query('headName')
    headName: string,
    @AuthUser() user: User,
  ): Promise<COA[]> {
    this.loggerService.log(`GET User/ ${LoggerMessages.API_CALLED}`);
    return this.coaService.findChildByHead(headName);
  }

  @Get('nodes')
  @Auth(Action.Read, 'COA')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get COA Nodes',
    type: COA,
  })
  coaList(@AuthUser() user: User): Promise<COA[]> {
    this.loggerService.log(`GET COA Nodes/ ${LoggerMessages.API_CALLED}`);
    return this.coaService.getCOAList();
  }

  /**
   *
   * @get COA Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Coa')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Coa Schema',
    type: COA,
  })
  getcoaSchema() {
    this.loggerService.log(`GET COA Schema/ ${LoggerMessages.API_CALLED}`);
    return this.coaService.getSchema();
  }
}
