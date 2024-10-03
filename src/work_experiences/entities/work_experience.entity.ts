import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm"
import { OnlineProfile } from "src/online_profiles/entities"
import { BadRequestException } from "@nestjs/common"

@Entity()
export class WorkExperience extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    jobTitle: string

    @Column()
    companyName: string

    @Column({ type: 'date'})
    startDate: Date

    @Column({ type: 'date', nullable: true })   // null = (isDoing = true)
    endDate: Date | null

    @Column({ type: 'text'})
    jobDescription: string

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

    @ManyToOne(() => OnlineProfile, (online_profile) => online_profile.work_experiences, {
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE' 
    })
    online_profile: OnlineProfile

} 