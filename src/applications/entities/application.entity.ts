import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne,  CreateDateColumn, JoinColumn, UpdateDateColumn } from "typeorm"
import { Employee } from "src/employees/entities"
import { JobPosting } from "src/job_postings/entities"
import { ApplicationType, ApprovalStatus } from "src/shared/enums"



@Entity('applications')
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    application_id: number

    @Column({
        type: 'enum',
        enum: ApplicationType,
        default: ApplicationType.online_profile
    })
    applicationType: ApplicationType

    @Column({ nullable: true })
    cv: string

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    phone: string

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedDate: Date

    @Column({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.pending
    })
    status: ApprovalStatus

    @ManyToOne(() => Employee, (employee) => employee.applications, {
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE' 
    })
    employee: Employee

    @ManyToOne(() => JobPosting, (jobPosting) => jobPosting.applications, {
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE' 
    })
    jobPosting: JobPosting
}