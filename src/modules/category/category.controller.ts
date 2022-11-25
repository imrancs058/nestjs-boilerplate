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
import { Category } from './category.schema';
import { CategoryService } from './category.service';
import { LoggerService } from '../../logger/logger.service';
import { LoggerMessages } from '../../exceptions/index';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPageOkResponse, Auth } from '../../decorators';
import { Action } from '../../casl/userRoles';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('category controller');
  }
  /**
   * Get Category
   * @param PageOptionsDto
   * @returns
   */
  @Get()
  @Auth(Action.Read, 'Category')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get category list',
    type: Category,
  })
  getCategories(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Category[]> {
    this.loggerService.log(`GET Category/ ${LoggerMessages.API_CALLED}`);
    return this.categoryService.getCategories(pageOptionsDto);
  }

  /**
   *
   * @get category by id
   * @param id
   * @return
   *
   */
  @Get('/id:id')
  @Auth(Action.Read, 'Category')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Category By Id',
    type: Category,
  })
  async getCategoryById(@Param('id') id: string): Promise<Category[]> {
    this.loggerService.log(`GET Category By Id/ ${LoggerMessages.API_CALLED}`);
    return this.categoryService.findById(id);
  }
  /**
   *
   * @create category and subcategory
   * @param object
   * @return
   *
   */
  @Post()
  @Auth(Action.Create, 'Category')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: Category, description: 'Successfully Created' })
  async create(@Body() categoryDto: Category): Promise<Category> {
    this.loggerService.log(`Post Category/ ${LoggerMessages.API_CALLED}`);
    return await this.categoryService.create(categoryDto);
  }
  /**
   * @patch  category
   * @param id & object
   * @return
   *
   */
  @Patch(':id')
  @Auth(Action.Update, 'Category')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Category, description: 'Updated Sucessfully' })
  async update(
    @Param('id') id: string,
    @Body() categoryDto: Category,
  ): Promise<Category> {
    this.loggerService.log(`Patch Category/ ${LoggerMessages.API_CALLED}`);
    return await this.categoryService.update(id, categoryDto);
  }
  /**
   *@delete category
   * @param id
   * @return
   */
  @Delete(':id')
  @Auth(Action.Delete, 'Category')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ type: Category, description: 'Deleted Sucessfully' })
  async delete(@Param('id') id: string): Promise<Category> {
    this.loggerService.log(`Delete Category/ ${LoggerMessages.API_CALLED}`);
    return await this.categoryService.delete(id);
  }

  /**
   * category and subcategory with list
   */
  @Get('list')
  @Auth(Action.Read, 'Category')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get category with subcategory list',
    type: Category,
  })
  CategorywithSubCategoryList(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<Category[]> {
    this.loggerService.log(
      `GET Category wit sub Category/ ${LoggerMessages.API_CALLED}`,
    );
    return this.categoryService.CategorywithSubCategoryList(pageOptionsDto);
  }

  /**
   *
   * @get Category Schema
   * @return
   *
   */
  @Get('/schema')
  @Auth(Action.Read, 'Category')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get Category Schema',
    type: Category,
  })
  getcategorySchema() {
    this.loggerService.log(`GET Category Schema/ ${LoggerMessages.API_CALLED}`);
    return this.categoryService.getSchema();
  }
}
