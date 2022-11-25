import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { dryJsonSchema, Dry, DryDocument } from './dry.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { DryDtoDto } from './dto/dryDto.dto';
import { PackingService } from '../packing/packing.service';
import { LabourExpenseService } from '../labourExpense/labourExpense.service';

@Injectable()
export class DryService {
  constructor(
    @InjectModel(Dry.name)
    private dryModel: Model<Dry>,
    private packingService: PackingService,
    private labourExpenseService: LabourExpenseService,
  ) {}

  /**
   * get Dry schema
   * @returns
   */
  async getSchema() {
    const drySchema = await dryJsonSchema.Dry;
    drySchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: drySchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all dry
   * @param pageOptionsDto
   * @returns
   */

  async getDry(pageOptionsDto: PageOptionsDto): Promise<Dry[]> {
    const queryBuilder = await this.dryModel
      .aggregate([
        {
          $match: {
            isActive: true,
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
   * get single Dry
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Dry[]> {
    const queryBuilder = await this.dryModel
      .find({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async getDryByFK(id: string): Promise<Dry[]> {
    const queryBuilder = await this.dryModel
      .aggregate([
        {
          $match: {
            isActive: true,
            productionOutputId: id,
          },
        },
      ])
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
  async create(
    createDto: Dry,
    poId: string,
    productItemId: string,
  ): Promise<DryDocument> {
    const create: DryDocument = new this.dryModel(createDto);
    const createDry = await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
    if (createDto.hasOwnProperty('Packing')) {
      this.packCreate(createDry.id, createDto['Packing'], poId, productItemId);
    }
    if (createDto.hasOwnProperty('labourExpenseSchema')) {
      await this.labourExpenseService.createByProduction(
        createDto['labourExpenseSchema'],
        createDry.id,
      );
    }
    return createDry;
  }
  // **************
  async packCreate(id: string, item: any, poId: string, productItemId: string) {
    for (let i = 0; i < item.length; i++) {
      item[i]['productionOutputId'] = poId;
      item[i]['dryId'] = id;
      const resp = await this.packingService
        .create(item[i], poId, productItemId)
        .catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }
  }
  /**
   *
   * patch
   * @param id & dry object
   * @return
   */
  async update(id: string, dryData: DryDtoDto): Promise<DryDocument> {
    return await this.dryModel
      .findByIdAndUpdate({ _id: id }, dryData)
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
    /**
     * delete 'Packing' of 'Dry'
     */
    const productionOutput = await this.packingService.getPackingByDryFK(id);
    productionOutput.forEach(async (item) => {
      await this.packingService.delete(item['_id']);
    });
    /**
     * delete 'labourExpense' of 'Dry'
     */
    const existingExpense =
      await this.labourExpenseService.getlabourExpenseByFK(id);
    existingExpense.forEach(async (item) => {
      await this.labourExpenseService.delete(item['_id']);
    });
    /**
     * delete 'Dry'
     */
    return await this.dryModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
