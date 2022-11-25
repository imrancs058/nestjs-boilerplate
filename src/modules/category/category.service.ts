import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Category,
  CategoryDocument,
  cateforyJsonSchema,
} from './category.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * get category schema
   * @returns
   */
  async getSchema() {
    const category = cateforyJsonSchema.Category;
    const cateSchema = {};
    cateSchema['title'] = category.title;
    cateSchema['type'] = category.type;
    cateSchema['required'] = ['name', 'status'];
    cateSchema['properties'] = category.properties;
    cateSchema['properties']['_id'] = {
      type: 'string',
    };
    cateSchema['properties']['category'] = {
      type: 'string',
      minLength: 3,
      title: 'Category',
    };
    const ui = {
      _id: { 'ui:widget': 'hidden' },
      category: {
        'ui:widget': 'hidden',
      },
      categoryId: { 'ui:widget': 'myCustomSelectTypeAhead' },
    };

    const cat = await this.getCategories({
      column: '_id',
      order: 1,
      take: 10,
      skip: 0,
    });
    const categoryId = [];
    const categoryName = [];
    cat[0]['data'].forEach((element) => {
      categoryId.push(element._id);
      categoryName.push(element.name);
    });
    cateSchema['properties']['categoryId']['enum'] = categoryId;
    cateSchema['properties']['categoryId']['enumNames'] = categoryName;

    const customSchema = { schema: cateSchema, uischema: ui };
    return customSchema;
  }

  /**
   * get all category
   * @param pageOptionsDto
   * @returns
   */

  async getCategories(pageOptionsDto: PageOptionsDto): Promise<Category[]> {
    const queryBuilder = await this.categoryModel
      .aggregate([
        {
          $match: {
            $and: [{ categoryId: null }, { isActive: true }],
          },
        },
        {
          $addFields: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
              { $skip: pageOptionsDto.skip },
              { $limit: pageOptionsDto.take },
            ],
          },
        },
        {
          $project: {
            data: 1,
            // Get total from the first element of the metadata array
            total: { $arrayElemAt: ['$metadata.total', 0] },
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }
  /**
   *
   * get single category
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Category[]> {
    const queryBuilder = await this.categoryModel
      .find({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async findOneById(id: string): Promise<Category> {
    const queryBuilder = await this.categoryModel
      .findOne({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }
  /**
   * post
   * @param categoryDto
   * @returns
   */
  async create(categoryDto: Category): Promise<CategoryDocument> {
    const create: CategoryDocument = new this.categoryModel(categoryDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }
  /**
   * get all category with subcategory
   * @param pageOptionsDto
   * @returns
   */

  async CategorywithsubCategory(): Promise<Category[]> {
    const queryBuilder = await this.categoryModel
      .aggregate([
        {
          $match: {
            $and: [{ categoryId: null }, { isActive: true }],
          },
        },
        {
          $graphLookup: {
            from: 'categories',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'categoryId',
            maxDepth: 0,
            as: 'childrens',
            restrictSearchWithMatch: { isActive: true },
          },
        },
        {
          $unwind: {
            path: '$childrens',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            subcategory: { $ifNull: ['$childrens.name', ''] },
            subcategoryId: { $ifNull: ['$childrens._id', ''] },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            isActive: 1,
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }
  /**
   * patch the category
   * @param id
   * @param categoryData object
   * @returns
   */
  async update(id: string, categoryData: Category): Promise<CategoryDocument> {
    return await this.categoryModel
      .findByIdAndUpdate({ _id: id }, categoryData)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
   * delete the category
   * @param id
   * @param categoryData object
   * @returns
   */

  async delete(id: string): Promise<any> {
    return await this.categoryModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  /**
   * get all category with subcategory list
   * @param pageOptionsDto
   * @returns
   */

  async CategorywithSubCategoryList(
    pageOptionsDto: PageOptionsDto,
  ): Promise<Category[]> {
    const schemaData = await cateforyJsonSchema.Category;
    const schemaKeys = Object.keys(schemaData.properties);
    const searchData = [];
    if (pageOptionsDto.q == '') {
      searchData.push({});
    } else {
      schemaKeys.map((element) => {
        const obj = {};
        obj[element] = { $regex: new RegExp(pageOptionsDto.q, 'i') };
        return searchData.push(obj);
      });
    }
    const queryBuilder = await this.categoryModel.aggregate([
      {
        $match: {
          $and: [{ categoryId: null }, { isActive: true }],
        },
      },
      {
        $graphLookup: {
          from: 'categories',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'categoryId',
          maxDepth: 0,
          as: 'subcategories',
          restrictSearchWithMatch: { isActive: true },
        },
      },
      {
        $unwind: {
          path: '$subcategories',
          preserveNullAndEmptyArrays: true,
        },
      },
      //we want to lock main cetegory editing
      {
        $project: {
          _id: { $ifNull: ['$subcategories._id', ''] },
          category: '$name',
          categoryId: '$_id',
          name: '$subcategories.name',
          date: 1,
          status: {
            $ifNull: [
              '$subcategories.status',
              '<span class="badge bg-success">Main</span>',
            ],
          },
          isActive: 1,
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          category: {
            $ifNull: ['$category', ''],
          },
          categoryId: 1,
          name: {
            $ifNull: ['$name', '<span class="badge bg-success">Main</span>'],
          },
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          isActive: 1,
        },
      },
      {
        $match: {
          $or: searchData,
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
            { $skip: pageOptionsDto.skip },
            { $limit: pageOptionsDto.take },
          ],
        },
      },
      {
        $project: {
          data: 1,
          // Get total from the first element of the metadata array
          total: { $arrayElemAt: ['$metadata.total', 0] },
        },
      },
    ]);
    return queryBuilder;
  }
}
