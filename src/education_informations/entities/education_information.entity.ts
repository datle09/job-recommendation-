import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm"
import { OnlineProfile } from "src/online_profiles/entities"
import { BadRequestException } from "@nestjs/common"

@Entity('education_informations')
export class EducationInformation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    schoolName: string

    @Column()
    specialization: string

    @Column()
    degreeName: string

    @Column({ type: 'date'})
    startDate: Date

    @Column({ type: 'date'})
    endDate: Date

    @BeforeInsert()
    @BeforeUpdate()
    checkDates() {
        if (this.startDate && this.endDate) {
            const startDate = new Date(this.startDate);
            const endDate = new Date(this.endDate);
        
            if (startDate > endDate) {
              throw new BadRequestException('startDate must be before endDate');
            }
        }
    }

    @ManyToOne(() => OnlineProfile, (online_profile) => online_profile.education_informations, {
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE' 
    })
    online_profile: OnlineProfile

} 