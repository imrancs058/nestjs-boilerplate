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
import { PremiumService } from './premium.service';
import { Premium } from './premium.schema';

@Controller('premium')
@ApiTags('premium')
export class PremiumController {
  constructor(
    private premiumService: PremiumService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('premium controller');
  }

  /**
   *
   * @get premium
   * @param premiumDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Premium')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Premium',
    type: Premium,
  })
  getPremium(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Premium[]> {
    this.loggerService.log(`GET Premium/ ${LoggerMessages.API_CALLED}`);
    return this.premiumService.getPremium(pageOptionsDto);
  }
  /**
   *
   * @get premium by id
   * @param id
   * @return
   *
   */
  @Get('/byid/:id')
  @Auth(Action.Read, 'Premium')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Premium By Id',
    type: Premium,
  })
  async getPremiumById(@Param('id') id: string): Promise<Premium[]> {
    this.loggerService.log(`GET Premium By Id/ ${LoggerMessages.API_CALLED}`);
    return this.premiumService.findById(id);
  }

  /**
   *
   * @create premium
   * @param premiumDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Premium')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Premium, description: 'Successfully Created' })
  async create(@Body() premiumDto: Partial<Premium>): Promise<Premium> {
    this.loggerService.log(`Post Contractor/ ${LoggerMessages.API_CALLED}`);
    return await this.premiumService.create(premiumDto);
  }

  /**
   *
   * @update premium
   * @param premiumDto
   * @return
   *
   */
  @Patch(':id')
  //@Auth(Action.Update, 'Premium')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Premium, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() premiumDto: Partial<Premium>,
  ): Promise<Premium> {
    this.loggerService.log(`Patch Premium/ ${LoggerMessages.API_CALLED}`);
    return await this.premiumService.update(id, premiumDto);
  }

  /**
   *
   * @delete premium
   * @param premiumDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Premium')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Premium, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Premium> {
    this.loggerService.log(`Delete Premium/ ${LoggerMessages.API_CALLED}`);
    return this.premiumService.delete(id);
  }

  /**
   *
   * @get premium Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Premium')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Premium Schema',
    type: Premium,
  })
  getpremiumSchema() {
    this.loggerService.log(`GET Premium Schema/ ${LoggerMessages.API_CALLED}`);
    return this.premiumService.getSchema();
  }
}
