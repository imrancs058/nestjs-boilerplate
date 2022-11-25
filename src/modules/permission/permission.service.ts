import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseCode } from '../../exceptions';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Permission, PermissionDocument } from './permission.schema';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}
  /**
   * get all roll
   * @param pageOptionsDto
   * @returns
   */

  async getPermission(pageOptionsDto: PageOptionsDto): Promise<Permission[]> {
    const queryBuilder = await this.permissionModel
      .aggregate([
        {
          $match: {
            isActive: true,
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
   * get single Permission
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Permission[]> {
    const queryBuilder = await this.permissionModel
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
  async create(createDto: any): Promise<PermissionDocument[]> {
    const createObj = await this.permissionModel
      .insertMany(createDto)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return createObj;
  }
  /**
   *
   * patch
   * @param id & PermissionData object
   * @return
   */
  async update(
    id: string,
    PermissionData: Partial<Permission>,
  ): Promise<PermissionDocument> {
    return await this.permissionModel
      .findByIdAndUpdate({ _id: id }, PermissionData)
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
    return await this.permissionModel
      .remove({ role_acl_id: id })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
