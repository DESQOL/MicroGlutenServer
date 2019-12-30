import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    firstname: string

    @Column({ default: '' })
    lastname: string

    @Column()
    email: string

    @Column()
    password: string
}
