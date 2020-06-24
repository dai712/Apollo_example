import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, ManyToOne } from "typeorm"
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User"

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sendedUserNickname!: String;

  @Column()
  title!: string;

  @Column({type: "varchar", default: ""})
  content?: string;

  @ManyToOne(
    (type) => User,
    (user) => user.messageBox, {nullable: false, onDelete: 'CASCADE'}
  )
  user!: User;
}