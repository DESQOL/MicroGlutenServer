import bcrypt from 'bcrypt';
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsString, MinLength } from 'class-validator';

@Entity()
export class User {
    public static from (obj: object): User {
        return Object.assign(new User(), obj);
    }

    public static async hashPassword (password: string): Promise<string> {
        const hash = await bcrypt.genSalt();
        return bcrypt.hash(password, hash);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    @IsString()
    firstname: string;

    @Column({ default: '' })
    @IsString()
    lastname: string;

    @Column()
    @IsEmail()
    email: string;

    @Column({ select: false })
    @MinLength(8)
    password: string;

    public async validatePassword (password: string): Promise<boolean> {
        const user = await getRepository(User).findOne(this.id, { select: ['password'] });
        return bcrypt.compare(password, user.password);
    }
}
