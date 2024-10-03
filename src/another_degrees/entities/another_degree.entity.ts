import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { OnlineProfile } from "src/online_profiles/entities"


@Entity('another_degrees')
export class AnotherDegree extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    degreeName: string

    @Column()
    level: string

    @ManyToOne(() => OnlineProfile, (online_profile) => online_profile.another_degrees, { 
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE' 
    })
    online_profile: OnlineProfile

} 