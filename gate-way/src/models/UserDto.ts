import {IsEmail, IsNotEmpty, IsPhoneNumber, IsStrongPassword,} from 'class-validator';
import {Consts} from '../Utils/consts';
import {Field, ObjectType, PartialType} from '@nestjs/graphql';

@ObjectType()
export class CreateUserDto {
    @Field({
        nullable: false,
        name: 'firstName',
        description: Consts.yourRealName,
    })
    @IsNotEmpty()
     firstName: string;

    @Field({
        nullable: false,
        name: 'lastName',
        description: Consts.yourRealFamily,
    })
    @IsNotEmpty({message: Consts.lastNameRequiredMessage})
     lastName: string;

    @Field({nullable: false, name: 'email', description: Consts.yourRealEmail})
    @IsEmail()
    @IsNotEmpty({message: Consts.emailRequiredMessage})
     email: string;

    @Field({nullable: false, name: 'phone', description: Consts.yourRealPhone})
    @IsPhoneNumber('IR', {message: Consts.phoneRequiredMessage})
     phone: string;

    @Field({nullable: false, name: 'userName', description: Consts.yourUserName})
    @IsNotEmpty({message: Consts.usernameRequiredMessage})
     userName: string;

    @Field({nullable: false, name: 'password', description: Consts.yourPassword})
    @IsStrongPassword({minLength: 2}, {message: Consts.minLengthOfPassword})
    @IsNotEmpty({message: Consts.passwordRequiredMessage})
     password: string;
}

@ObjectType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @Field({nullable: false, name: 'id', description: Consts.yourUserIdentifier})
    @IsNotEmpty({message: Consts.UserIdIsRequired})
     id: string;
    @Field({nullable: true, name: 'createDate', description: Consts.createDate})
    createDate: string;
    @Field({nullable: true, name: 'updateDate', description: Consts.updateDate})
    updateDate: string;
    @Field({nullable: true, name: 'deleteDate', description: Consts.deleteDate})
    deleteDate: string;
    @Field({nullable: true, name: 'isActive', description: Consts.isActive})
    isActive: boolean;
    @Field(()=>[String],{nullable: true, name: 'rules', description: Consts.rules,defaultValue:["Guest"]})
    rules: string[];
}

@ObjectType()
export class Users extends PartialType(UpdateUserDto) {
}

@ObjectType()
export class DeleteUserDto {
    @Field(()=>[String],{nullable: false, name: 'ids', description: Consts.ids})
     ids: string[];
}

@ObjectType()
export class ActiveUserDto {
    @Field(()=>[String],{nullable: false, name: 'ids', description: Consts.ids})
     ids: string[];
}

@ObjectType()
export class AddRulesToUserDto {
    @Field(()=>[String],{nullable: false, name: 'ids', description: Consts.ids})
     ids: string[];

    @Field(()=>[String],{nullable: false, name: 'rules', description: Consts.rules})
     rules: string[];
}
