import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"


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

  @Column()
  testPostgres!: boolean;
}