import { Entity, BaseEntity, PrimaryColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Employee } from "src/employees/entities"
import { Degree, EmploymentType, Experience, PositionLevel, Profession } from "src/shared/enums"


@Entity('attached_documents')
export class AttachedDocument extends BaseEntity {
    @PrimaryColumn()
    userId: number;

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
        enum: PositionLevel,
        default: PositionLevel.Employee
    })
    currentPosition: PositionLevel

    @Column({
        type: 'enum',
        enum: PositionLevel,
        default: PositionLevel.Employee
    })
    desiredPosition: PositionLevel

    @Column()
    desiredSalary: number

    @Column({
        type: 'enum',
        enum: Degree,
        default: Degree.Other
    })
    degree: Degree

    @Column()
    workAddress: string

    @Column({
        type: 'enum',
        enum: Experience,
        default: Experience.Zero
    })
    experience: Experience

    @Column({
        type: 'enum',
        enum: EmploymentType,
        default: EmploymentType.Other
    })
    employmentType: EmploymentType

    @Column({ nullable: true })
    careerGoal: string

    @Column({ nullable: true })
    skills: string

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedDate: Date

    @Column({ default: false })
    isHidden: boolean

    @Column({ default: 0 })
    view: number

    @Column({ nullable: true }) // link to cv
    cv: string

    @OneToOne(() => Employee, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'userId'
    })
    employee: Employee
}