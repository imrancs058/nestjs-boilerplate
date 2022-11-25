/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument, bookJsonSchema } from './book.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { BookDtoDto } from './dto/bookDto.dto';
import { BookItemService } from '../bookItem/bookItem.service';
import { CustomerService } from '../customer/customer.service';
import { CategoryService } from '../category/category.service';
import { SaleOfficerService } from '../saleOfficer/saleOfficer.service';
import { StockService } from '../stock/stock.service';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: Model<Book>,
    private bookItemService: BookItemService,
    private customerService: CustomerService,
    private categoryService: CategoryService,
    private saleOfficerService: SaleOfficerService,
    private stockService: StockService,
  ) {}

  /**
   * get book schema
   * @returns
   */
  async getSchema() {
    const bookSchema = await bookJsonSchema.Book;
    bookSchema['properties']['_id'] = {
      type: 'string',
    };
    delete bookSchema['properties']['categoryId'];
    delete bookSchema['properties']['type'];
    delete bookSchema['properties']['area'];
    
    const bookItemSchema = await this.bookItemService.getSchema();
    delete bookItemSchema.schema['properties']['qty'];
    bookSchema.properties.bookItemSchema = {
      type: 'array',
      title: 'Book Item',
      items: bookItemSchema.schema,
    };
    //  ***********************************************************
    // <-----------> Start :: customer <----------->
    const customerData = await this.customerService.getCustomer({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const customerIdData = [''];
    const customerNameData = [''];
    customerData[0]['data'].forEach((element) => {
      customerIdData.push(element['_id']);
      customerNameData.push(element['concernedPerson']);
    });
    bookSchema.properties.customerId = {
      type: 'string',
      title: 'Customer Name',
    };
    bookSchema.properties.customerId['enum'] = customerIdData;
    bookSchema.properties.customerId['enumNames'] = customerNameData;
    // <-----------> End :: customer <----------->

    // <-----------> Start :: category <----------->
    const categoryData = await this.categoryService.CategorywithsubCategory();
    bookSchema.properties.categoryId = {
      title: 'Category',
      type: 'string',
      selectValue: categoryData,
    };
    // <-----------> End :: category <----------->
    // <-----------> Start :: saleOfficer <----------->
    const saleOfficerData = await this.saleOfficerService.getSaleOfficer({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const saleOfficerIdData = [''];
    const saleOfficerNameData = [''];
    saleOfficerData[0]['data'].forEach((element) => {
      saleOfficerIdData.push(element['_id']);
      saleOfficerNameData.push(element['firstName'] + '' + element['lastName']);
    });
    bookSchema.properties.saleOfficerId = {
      type: 'string',
      title: 'Sale Officer',
    };
    bookSchema.properties.saleOfficerId['enum'] = saleOfficerIdData;
    bookSchema.properties.saleOfficerId['enumNames'] = saleOfficerNameData;
    // <-----------> End :: saleOfficer <----------->

    // <-----------> Start :: stock <----------->
    // const stockData = await this.stockService.getStock();
    // bookItemSchema.schema.properties.itemId = {
    //   title: 'Product',
    //   type: 'string',
    //   selectValue: stockData,
    // };
    const stockData = await this.stockService.getStock({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const stockIdData = [''];
    const stockNameData = [''];
    stockData[0]['data'].forEach((element) => {
      stockIdData.push(element['_id']);
      stockNameData.push(element['productItem']);
    });
    bookItemSchema.schema.properties.itemId = {
      type: 'string',
      title: 'Product',
    };
    bookItemSchema.schema.properties.itemId['enum'] = stockIdData;
    bookItemSchema.schema.properties.itemId['enumNames'] = stockNameData;
    bookItemSchema.schema.properties.qty = {
      type: 'number',
      title: 'Quantity',
    };
    // <-----------> End :: stock <----------->

    // bookSchema.properties.concernPerson = {
    //   type: 'string',
    //   title: 'Concern Person',
    // };
    // bookSchema.properties.contactNumber = {
    //   type: 'string',
    //   title: 'Contact Number',
    // };

    // bookSchema.properties.bookingAmount = {
    //   type: 'string',
    //   title: 'Booking Amount',
    // };
    // bookSchema.properties.noOfCouponBooked = {
    //   type: 'string',
    //   title: 'No Of Coupon Booked',
    // };
    // bookSchema.properties.noOfBages = {
    //   type: 'string',
    //   title: 'No Of Bages',
    // };
    // bookSchema.properties.prNumber = {
    //   type: 'string',
    //   title: 'PR Number',
    // };
    // bookSchema.properties.prAmount = {
    //   type: 'string',
    //   title: 'PR Amount',
    // };
    //  ***********************************************************

    const customSchema = {
      schema: bookSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        bookItemSchema: {
          items: {
            _id: { 'ui:widget': 'hidden' },
            itemId: { 'ui:widget': 'myBookSelect' },
          },
          'ui:options': {
            orderable: false,
          },
        },
        //  -------------------------
        customerId: { 'ui:widget': 'myBookSelect' },
        categoryId: { 'ui:widget': 'myCustomCategoryTypeAhead' },
        saleOfficerId: { 'ui:widget': 'myBookSelect' },
        required: ['categoryId', 'destination'],
        'ui:order': [
          'bookNo',
          'customerId',
          'destination',
          // 'concernPerson',
          // 'contactNumber',
          'categoryId',
          'saleOfficerId',
          // 'bookingAmount',
          // 'noOfCouponBooked',
          // 'noOfBages',
          // 'prNumber',
          // 'prAmount',
          '*',
        ],
        //  -------------------------
      },
    };
    return customSchema;
  }

  /**
   * get all book
   * @param pageOptionsDto
   * @returns
   */

  async getBook(pageOptionsDto: PageOptionsDto): Promise<Book[]> {
    const queryBuilder = await this.bookModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'bookitems',
            let: { id: '$_id' },
            pipeline: [{ $match: { $expr: { $eq: ['$bookId', '$$id'] } } }],
            as: 'bookItemSchema',
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
   * get single Book
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Book[]> {
    const queryBuilder = await this.bookModel
      .find({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  /**
   * post
   * @param createDto
   * @returns
   */
  async create(createDto: Book): Promise<BookDocument> {
    const create: BookDocument = new this.bookModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & book object
   * @return
   */
  async update(id: string, bookData: BookDtoDto): Promise<BookDocument> {
    return await this.bookModel
      .findByIdAndUpdate({ _id: id }, bookData)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  /**
   *
   * delete
   * @param id
   * @return
   */
  async delete(id: string): Promise<any> {
    return await this.bookModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
