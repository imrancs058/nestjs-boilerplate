import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseInterceptors,
    ValidationPipe,
  } from '@nestjs/common';
  import { ApiResponse, ApiTags } from '@nestjs/swagger';
  import { UserService } from './user.service';
  import { LoggerService } from '../../logger/logger.service';
  import {LoggerMessages} from '../../exceptions/index';
  import { ApiPageOkResponse, Auth, AuthUser } from '../../decorators';
  import { RoleType } from '../../constants';
  import {User} from './user.schema'
  import { PageOptionsDto } from '../../common/dto/page-options.dto';
@Controller('user')
@ApiTags('users')
export class UserController {
    constructor(
        private userService: UserService,
        private readonly loggerService: LoggerService
      ) {this.loggerService.setContext('users controller');}
    
      /**
       * Get Users 
       * @param PageOptionsDto
       * @returns
       */
      @Get()
      @Auth([RoleType.USER])
      @HttpCode(HttpStatus.OK)
      @ApiPageOkResponse({
        description: 'Get users list',
        type: User,
      })
      getUsers(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: PageOptionsDto
      ):Promise<User[]> {
        this.loggerService.log(`GET User/ ${LoggerMessages.API_CALLED}`);
        return this.userService.getUsers(pageOptionsDto);
      }
}
