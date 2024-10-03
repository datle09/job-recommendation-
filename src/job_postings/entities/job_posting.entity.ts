import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, ManyToMany, UpdateDateColumn } from "typeorm"
import { Employer } from "src/employers/entities"
import { Degree, Sex, EmploymentType, Experience, PositionLevel, ApprovalStatus, Profession } from "src/shared/enums"
import { Application } from "src/applications/entities"

@Entity('job_postings')
export class JobPosting extends BaseEntity {
    @PrimaryGeneratedColumn()
    postId: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    phone: string

    @Column()
    contactAddress: string

    @Column()
    workAddress: string

    @Column()
    jobTitle: string

    @Column({
        type: 'enum',
        enum: Profession,
        default: [],
        array: true,
    })
    profession: Profession[]
    
    @Column({
        type: 'enum',
        enum: EmploymentType,
        default: EmploymentType.Other
    })
    employmentType: EmploymentType

    @Column({
        type: 'enum',
        enum: Degree,
        default: Degree.Other
    })
    degree: Degree

    @Column({
        type: 'enum',
        enum: Experience,
        default: Experience.Zero
    })
    experience: Experience

    @Column({
        type: 'enum',
        enum: PositionLevel,
        default: PositionLevel.Employee
    })
    positionLevel: PositionLevel

    @Column({ nullable: true })
    minAge: number

    @Column({ nullable: true })
    maxAge: number

    @Column({
        type: 'enum',
        enum: Sex,
        nullable: true
    })
    sex: Sex | null

    @Column()
    numberOfVacancies: number

    @Column({ nullable: true })
    trialPeriod: number

    @Column({ type: 'date'})
    applicationDeadline: Date

    @Column({ nullable: true })
    minSalary: number

    @Column({ nullable: true })
    maxSalary: number

    @Column({ nullable: true })
    skills: string

    @Column({ type: 'text' })
    jobDescription: string

    @Column({ type: 'text' })
    jobRequirements: string

    @Column({ type: 'text' })
    benefits: string

    @Column({ default: 0 })
    submissionCount: number

    @Column({ default: 0 })
    view: number

    @Column({ default: false })
    isHidden: boolean

    @Column({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.pending
    })
    status: ApprovalStatus

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedDate: Date

    @ManyToOne(() => Employer, (employer) => employer.job_postings, {
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE' 
    })
    employer: Employer

    @OneToMany(() => Application, (application) => application.jobPosting)
    applications: Application[]
} 