import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('urls')
class Url {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column()
  lottery!: string;

  @Column()
  url!: string;

  @CreateDateColumn('created_at')
  createdAt!: Date;

  @UpdateDateColumn('updated_at')
  updatedAt!: Date;
}

export default Url;
