import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, Int, ObjectType, ID } from "type-graphql";

@Entity()
class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  nickname!: string;

  @Column()
  password!: string;

  @Column()
  email!: string;

  @Field(() => Int)
  @Column()
  money!: number;

  static findByNameAndEmail(nickname: string, email: string) {      //Active Record. 모델 내에서 쿼리질 가능.
    return this.createQueryBuilder('user')
      .where('user.nickname = :nickname', { nickname })
      .andWhere('user.email = :email', {email}).getMany()
  }
}