import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
class User {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column()
  name!: string;

  @Column()
  hash!: string;

  @CreateDateColumn('created_at')
  createdAt!: Date;

  @UpdateDateColumn('updated_at')
  updatedAt!: Date;
}

export default User;
