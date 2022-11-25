import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiPageOkResponse, Auth } from '../../decorators';
import { User } from './user.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Action } from '../../casl/userRoles';
@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('users controller');
  }

  /**
   * Get Users
   * @param PageOptionsDto
   * @returns
   */
  @Get()
  @Auth(Action.Read, 'User')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: User,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
    // @AuthUser() user: User,
  ): Promise<User[]> {
    this.loggerService.log(`GET User/ ${LoggerMessages.API_CALLED}`);
    return this.userService.getUsers(pageOptionsDto);
  }
  /**
   *
   * @get user Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'User')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get User Schema',
    type: User,
  })
  getuserSchema() {
    this.loggerService.log(`GET User Schema/ ${LoggerMessages.API_CALLED}`);
    return this.userService.getSchema();
  }
}
