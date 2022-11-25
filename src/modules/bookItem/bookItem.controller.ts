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
import { BookItemService } from './bookItem.service';
import { BookItem } from './bookItem.schema';
import { BookItemDtoDto } from './dto/bookItemDto.dto';

@Controller('bookItem')
@ApiTags('bookItem')
export class BookItemController {
  constructor(
    private bookItemService: BookItemService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('BookItem controller');
  }

  /**
   *
   * @get BookItem
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'BookItem')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get BookItem',
    type: BookItem,
  })
  getBookItem(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<BookItem[]> {
    this.loggerService.log(`GET BookItem/ ${LoggerMessages.API_CALLED}`);
    return this.bookItemService.getBookItem(pageOptionsDto);
  }
  /**
   *
   * @get BookItem by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'BookItem')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get BookItem By Id',
    type: BookItem,
  })
  async getBookItemById(@Param('id') id: string): Promise<BookItem[]> {
    this.loggerService.log(`GET BookItem By Id/ ${LoggerMessages.API_CALLED}`);
    return this.bookItemService.findById(id);
  }

  /**
   *
   * @create BookItem
   * @param bookItemData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'BookItem')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: BookItem, description: 'Successfully Created' })
  async create(@Body() bookItemData: BookItem): Promise<BookItem> {
    this.loggerService.log(`Post BookItem/ ${LoggerMessages.API_CALLED}`);
    return await this.bookItemService.create(bookItemData);
  }

  /**
   *
   * @update BookItem
   * @param bookItemDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'BookItem')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: BookItem, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() bookItemDto: BookItemDtoDto,
  ): Promise<BookItem> {
    this.loggerService.log(`Patch BookItem/ ${LoggerMessages.API_CALLED}`);
    return await this.bookItemService.update(id, bookItemDto);
  }

  /**
   *
   * @delete BookItem
   * @param BookItemDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'BookItem')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: BookItem, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<BookItem> {
    this.loggerService.log(`Delete BookItem/ ${LoggerMessages.API_CALLED}`);
    return this.bookItemService.delete(id);
  }
  /**
   *
   * @get Book Item Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'BookItem')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Book Item Schema',
    type: BookItem,
  })
  getbookItemSchema() {
    this.loggerService.log(
      `GET Book Item Schema/ ${LoggerMessages.API_CALLED}`,
    );
    return this.bookItemService.getSchema();
  }
}
