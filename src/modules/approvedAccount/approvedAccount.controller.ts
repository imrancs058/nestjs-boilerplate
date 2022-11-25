/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  // eslint-disable-next-line prettier/prettier
  Post,
} from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse, Auth } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { ApprovedAccountService } from './approvedAccount.service';
import { ApprovedAccount } from './approvedAccount.schema';

@Controller('approvedAccount')
@ApiTags('approvedAccount')
export class ApprovedAccountController {
  constructor(
    private approvedAccountService: ApprovedAccountService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('ApprovedAccount controller');
  }

  /**
   *
   * @create ApprovedAccount
   * @param ApprovedAccountData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'ApprovedAccount')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ApprovedAccount, description: 'Successfully Created' })
  async create(@Body() ApprovedAccountData: ApprovedAccount): Promise<ApprovedAccount> {
    this.loggerService.log(`Post ApprovedAccount/ ${LoggerMessages.API_CALLED}`);
    return await this.approvedAccountService.create(ApprovedAccountData);
  }

  /**
   *
   * @get ApprovedAccount Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'ApprovedAccount')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get ApprovedAccount Schema',
    type: ApprovedAccount,
  })
  getbankSchema() {
    this.loggerService.log(`GET ApprovedAccount Schema/ ${LoggerMessages.API_CALLED}`);
    return this.approvedAccountService.getSchema();
  }
}
