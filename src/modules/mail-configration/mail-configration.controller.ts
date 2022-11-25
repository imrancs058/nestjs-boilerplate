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
import { MailConfigrationService } from './mail-configration.service';
import { Action } from '../../casl/userRoles';
import { MailConfigration } from './mail-configration.schema';
import { LoggerMessages } from 'src/exceptions';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

@Controller('mail-configration')
export class MailConfigrationController {
  constructor(
    private mailService: MailConfigrationService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('MailConfigrationService controller');
  }
  /**
   *
   * @create MailConfigration
   * @param MailConfigrationDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'MailConfigration')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: MailConfigration,
    description: 'Successfully Created',
  })
  async create(
    @Body() mailConfigrationDto: MailConfigration,
  ): Promise<MailConfigration> {
    this.loggerService.log(
      `Post MailConfigration/ ${LoggerMessages.API_CALLED}`,
    );
    return await this.mailService.create(mailConfigrationDto);
  }

  /**
   *
   * @get MailConfigration
   * @param MailConfigrationDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'MailConfigration')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get MailConfigration',
    type: MailConfigration,
  })
  getMailConfigration(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<MailConfigration> {
    this.loggerService.log(
      `GET MailConfigration/ ${LoggerMessages.API_CALLED}`,
    );
    return this.mailService.getMailConfigration();
  }
  /**
   *
   * @get MailConfigration by id
   * @param id
   * @return
   *
   */
  @Get('/byid/:id')
  @Auth(Action.Read, 'MailConfigration')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get MailConfigration By Id',
    type: MailConfigration,
  })
  async getMailConfigrationById(
    @Param('id') id: string,
  ): Promise<MailConfigration[]> {
    this.loggerService.log(
      `GET MailConfigration By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.mailService.findById(id);
  }

  /**
   *
   * @update MailConfigration
   * @param MailConfigrationDto
   * @return
   *
   */
  @Patch(':id')
  //@Auth(Action.Update, 'MailConfigration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: MailConfigration, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() mailConfigrationDto: Partial<MailConfigration>,
  ): Promise<MailConfigration> {
    this.loggerService.log(
      `Patch MailConfigration/ ${LoggerMessages.API_CALLED}`,
    );
    return await this.mailService.update(id, mailConfigrationDto);
  }

  /**
   *
   * @delete MailConfigration
   * @param MailConfigrationDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'MailConfigration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: MailConfigration, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<MailConfigration> {
    this.loggerService.log(
      `Delete MailConfigration/ ${LoggerMessages.API_CALLED}`,
    );
    return this.mailService.delete(id);
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
    type: MailConfigrationService,
  })
  async getcompanySchema() {
    this.loggerService.log(`GET Company Schema/ ${LoggerMessages.API_CALLED}`);
    return await this.mailService.getSchema();
  }
}
