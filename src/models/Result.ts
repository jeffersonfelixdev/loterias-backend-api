import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('results')
class Result {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column({ name: 'lottery', type: 'string' })
  lottery!: string;

  @Column({ name: 'result_number', type: 'number' })
  resultNumber!: number;

  @Column()
  data: unknown;

  @CreateDateColumn('created_at')
  createdAt!: Date;

  @UpdateDateColumn('updated_at')
  updatedAt!: Date;
}

export default Result;
