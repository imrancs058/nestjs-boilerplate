import {RoleType} from '../../src/constants/role-type';


export const newUser=()=>{
    let user={
       firstName:"almuhasba",
       lastName:"cooperation",
       email:"almuhasba@gmail.com",
       password:"almuhasba",
       phone:"03023412345",
       role:RoleType.ADMIN,
       id:"",
       avatar:"testimage"
    };
    return user;
}