/* eslint-disable prettier/prettier */
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
import { Book } from './book.schema';
import { BookDtoDto } from './dto/bookDto.dto';
import { BookService } from './book.service';
import { BookItemService } from '../bookItem/bookItem.service';

@Controller('book')
@ApiTags('book')
export class BookController {
  constructor(
    private bookService: BookService,
    private bookItemService: BookItemService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('Book controller');
  }

  /**
   *
   * @get Book
   * @param pageOptionsDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'Book')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Book',
    type: Book,
  })
  getBook(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Book[]> {
    this.loggerService.log(`GET Book/ ${LoggerMessages.API_CALLED}`);
    return this.bookService.getBook(pageOptionsDto);
  }
  /**
   *
   * @get Book by id
   * @param id
   * @return
   *
   */

  @Get('byid/:id')
  @Auth(Action.Read, 'Book')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Book By Id',
    type: Book,
  })
  async getBookById(@Param('id') id: string): Promise<Book[]> {
    this.loggerService.log(`GET Book By Id/ ${LoggerMessages.API_CALLED}`);
    return this.bookService.findById(id);
  }

  /**
   *
   * @create Book
   * @param bookData
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Book')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Book, description: 'Successfully Created' })
  async create(@Body() bookData: Book): Promise<Book> {
    this.loggerService.log(`Post Book/ ${LoggerMessages.API_CALLED}`);
    
    const resp = await this.bookService.create(bookData);
    const bookId = resp.id;

    if(bookData.hasOwnProperty('bookItemSchema'))
    {
      const bookItemData = bookData['bookItemSchema'];
      for (let i = 0; i < bookItemData.length; i++) {

        bookItemData[i]['bookId'] = bookId;
        await this.bookItemService.create(bookItemData[i]);
      }
    }
    else
    {
      console.log("Please Add BookItem Details");
    }
    return ;
  }

  /**
   *
   * @update Book
   * @param bookDto
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Book')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Book, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() bookDto: BookDtoDto,
  ): Promise<Book> {
    this.loggerService.log(`Patch Book/ ${LoggerMessages.API_CALLED}`);

    const resp = await this.bookService.update(id, bookDto);
    const bookId = resp.id;

    if(bookDto.hasOwnProperty('bookItemSchema'))
    {
      const bookItemData = bookDto['bookItemSchema'];
      for (let i = 0; i < bookItemData.length; i++) {

        bookItemData[i]['bookId'] = bookId;
        const bookItem = await this.bookItemService.findOneById(bookItemData[i]['_id']);
        await this.bookItemService.update(bookItem['_id'], bookItemData[i]);
      }
    }
    else
    {
      console.log("Please Add BookItem Details");
    }
    return ;
  }

  /**
   *
   * @delete Book
   * @param BookDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Book')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Book, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<Book> {
    this.loggerService.log(`Delete Book/ ${LoggerMessages.API_CALLED}`);
    return this.bookService.delete(id);
  }

  /**
   *
   * @get Book Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Book')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Book Schema',
    type: Book,
  })
  async getbookSchema() {
    this.loggerService.log(`GET Book Schema/ ${LoggerMessages.API_CALLED}`);
    return await this.bookService.getSchema();
  }

}
