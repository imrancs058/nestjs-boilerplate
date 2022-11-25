import { HttpException, Injectable } from '@nestjs/common';
import { RoleAcl, RoleAclDocument, roleAclJsonSchema } from './role-acl.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseCode } from 'src/exceptions';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import acl from './role-acl';
import { PermissionService } from '../permission/permission.service';
@Injectable()
export class RoleAclService {
  constructor(
    @InjectModel(RoleAcl.name)
    private roleAclModel: Model<RoleAclDocument>,
    private permissionService: PermissionService,
  ) {}
  /**
   * get all roll
   * @param pageOptionsDto
   * @returns
   */

  async getRole(pageOptionsDto: PageOptionsDto): Promise<RoleAcl[]> {
    const queryBuilder = await this.roleAclModel
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
   * get single role
   * @param id
   * @returns
   */
  async findById(id: string): Promise<RoleAcl[]> {
    const queryBuilder = await this.roleAclModel
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
  async create(createDto: {
    permissionPost: string;
    name: string;
  }): Promise<RoleAclDocument> {
    const addRollRes = JSON.parse(createDto.permissionPost);
    const create: RoleAclDocument = new this.roleAclModel(createDto);
    const roleObj = await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
    const permissionKeys = Object.keys(addRollRes.permissions);
    const permissionData = [];
    permissionKeys.forEach((element) => {
      const permissionActionKeys = Object.keys(addRollRes.permissions[element]);
      permissionActionKeys.forEach((actionElement) => {
        permissionData.push({
          action: actionElement,
          role_acl_id: create._id,
          subject: element,
        });
      });
    });

    await this.permissionService.create(permissionData).catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });

    return roleObj;
  }
  /**
   *
   * patch
   * @param id & roleData object
   * @return
   */
  async update(
    id: string,
    roleData: {
      permissionPost: string;
      name: string;
    },
  ): Promise<RoleAclDocument> {
    const addRollRes = JSON.parse(roleData.permissionPost);
    const create: RoleAclDocument = await this.roleAclModel
      .findByIdAndUpdate({ _id: id }, { name: roleData.name })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });

    const permissionKeys = Object.keys(addRollRes.permissions);
    const permissionData = [];
    permissionKeys.forEach((element) => {
      const permissionActionKeys = Object.keys(addRollRes.permissions[element]);
      permissionActionKeys.forEach((actionElement) => {
        permissionData.push({
          action: actionElement,
          role_acl_id: id,
          subject: element,
        });
      });
    });
    await this.permissionService.delete(id).catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
    await this.permissionService.create(permissionData).catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });

    return create;
  }

  /**
   *
   * delete
   * @param id
   * @return
   */
  async delete(id: string): Promise<any> {
    return await this.roleAclModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  /**
   *
   * get single role
   * @param id
   * @returns
   */
  async findByIdWithPermission(id: string): Promise<any> {
    const queryBuilder = await this.roleAclModel
      .aggregate([
        {
          $match: {
            $and: [{ _id: new Types.ObjectId(id) }, { isActive: true }],
          },
        },
        {
          $lookup: {
            from: 'permissions',
            let: { id: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$role_acl_id', '$$id'] } } },
              {
                $group: {
                  _id: '$subject',
                  action: {
                    $addToSet: '$action',
                  },
                },
              },
            ],
            as: 'permissions',
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    const mainObj = {};
    queryBuilder[0].permissions.forEach((element) => {
      const obj = {};
      element.action.forEach((element1) => {
        obj[element1] = [null];
      });
      mainObj[element._id] = obj;
    });
    const obj1 = {
      name: queryBuilder[0].name,
      role: { 'Current Level of Function': [], permissions: mainObj },
    };

    return obj1;
  }

  /**
   * get all roll
   * @param pageOptionsDto
   * @returns
   */

  async getResourceList() {
    return acl;
  }

  /**
   * get Discount schema
   * @returns
   */
  async getSchema() {
    const roleSchema = await roleAclJsonSchema.RoleAcl;
    roleSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: roleSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }
}
