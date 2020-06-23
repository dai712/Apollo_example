import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;                  //UUID

  @Column("text")
  nickname!: string;            //닉네임

  @Column()
  email!: string;               //이메일

  @Column()
  password!: string;            //비번(Hash 된것)

  @Column({ type: "int", default: 100000 }) 
  money!: number;               //보유 머니

  @Column({ type: "bool", default: false })
  confirmed!: boolean;          //인증 (성인인증...등)

  @Column({ type: "varchar", default: "2000-00-00"})
  birthday!: String;            //생일
  
  @Column({ type: "varchar", default: "000-0000-0000"})
  phone!: String;               //핸드폰번호
}