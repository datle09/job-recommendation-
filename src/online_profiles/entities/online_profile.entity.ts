import { Entity, BaseEntity, PrimaryColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Employee } from "src/employees/entities"
import { Degree, EmploymentType, Experience, PositionLevel, Profession } from "src/shared/enums"
import { AnotherDegree } from "src/another_degrees/entities";
import { EducationInformation } from "src/education_informations/entities";
import { WorkExperience } from "src/work_experiences/entities";

@Entity('online_profiles')
export class OnlineProfile extends BaseEntity {
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

    @OneToOne(() => Employee, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'userId'
    })
    employee: Employee

    @OneToMany(() => AnotherDegree, (anotherdegree) => anotherdegree.online_profile)
    another_degrees: AnotherDegree[]

    @OneToMany(() => EducationInformation, (educationinformation) => educationinformation.online_profile)
    education_informations: EducationInformation[]

    @OneToMany(() => WorkExperience, (workExperience) => workExperience.online_profile)
    work_experiences: WorkExperience[]
}