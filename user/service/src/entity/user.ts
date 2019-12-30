import bcrypt from 'bcrypt';
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    public static async hashPassword (password: string): Promise<string> {
        const hash = await bcrypt.genSalt();
        return bcrypt.hash(password, hash);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    firstname: string;

    @Column({ default: '' })
    lastname: string;

    @Column()
    email: string;

    @Column({ select: false })
    password: string;

    public async validatePassword (password: string): Promise<boolean> {
        const user = await getRepository(User).findOne(this.id, { select: ['password'] });
        return bcrypt.compare(password, user.password);
    }
}
