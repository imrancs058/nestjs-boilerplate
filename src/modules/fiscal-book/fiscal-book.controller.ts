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
import { FiscalBookService } from './fiscal-book.service';
import { Action } from '../../casl/userRoles';
import { FiscalBook } from './fiscal-book.schema';
import { LoggerMessages } from 'src/exceptions';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

@Controller('fiscal-book')
export class FiscalBookController {
  constructor(
    private FiscalBookService: FiscalBookService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('FiscalBook controller');
  }
  /**
   *
   * @create FiscalBook
   * @param FiscalBookDto
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'FiscalBook')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: FiscalBook, description: 'Successfully Created' })
  async create(@Body() FiscalBookDto: FiscalBook): Promise<FiscalBook> {
    this.loggerService.log(`Post FiscalBook/ ${LoggerMessages.API_CALLED}`);
    return await this.FiscalBookService.create(FiscalBookDto);
  }

  /**
   *
   * @get FiscalBook
   * @param FiscalBookDto
   * @return
   *
   */
  @Get('list')
  @Auth(Action.Read, 'FiscalBook')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get FiscalBook',
    type: FiscalBook,
  })
  getFiscalBook(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<FiscalBook[]> {
    this.loggerService.log(`GET FiscalBook/ ${LoggerMessages.API_CALLED}`);
    return this.FiscalBookService.getFiscalBook(pageOptionsDto);
  }
  /**
   *
   * @get FiscalBook by id
   * @param id
   * @return
   *
   */
  @Get('/byid/:id')
  @Auth(Action.Read, 'FiscalBook')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get FiscalBook By Id',
    type: FiscalBook,
  })
  async getFiscalBookById(@Param('id') id: string): Promise<FiscalBook[]> {
    this.loggerService.log(
      `GET FiscalBook By Id/ ${LoggerMessages.API_CALLED}`,
    );
    return this.FiscalBookService.findById(id);
  }

  /**
   *
   * @update FiscalBook
   * @param FiscalBookDto
   * @return
   *
   */
  @Patch(':id')
  //@Auth(Action.Update, 'FiscalBook')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: FiscalBook, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() FiscalBookDto: Partial<FiscalBook>,
  ): Promise<FiscalBook> {
    this.loggerService.log(`Patch FiscalBook/ ${LoggerMessages.API_CALLED}`);
    return await this.FiscalBookService.update(id, FiscalBookDto);
  }

  /**
   *
   * @delete FiscalBook
   * @param FiscalBookDto
   * @return
   *
   */
  @Delete(':id')
  @Auth(Action.Delete, 'FiscalBook')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: FiscalBook, description: 'Delete Sucessfully' })
  async delete(@Param('id') id: string): Promise<FiscalBook> {
    this.loggerService.log(`Delete FiscalBook/ ${LoggerMessages.API_CALLED}`);
    return this.FiscalBookService.delete(id);
  }
}
