import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import { ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  nickname!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  money!: number;

  @Column({ type: "bool", default: false })
  confirmed!: boolean;
}