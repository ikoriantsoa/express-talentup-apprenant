import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { ICryptage } from '../cryptage/ICryptage';
  
  @Entity('talentapprenant')
  export class TalentApprenant {
    @PrimaryColumn({name: 'keycloakId',type: 'uuid', nullable: false, unique: true })
    keycloakId!: string;
  
    @Column({name: 'username', type: 'jsonb', nullable: false, unique: true })
    username!: ICryptage;
  
    @Column({name: 'email', type: 'jsonb', nullable: false, unique: true })
    email!: ICryptage;
  
    @Column({name: 'lastname', type: 'jsonb', nullable: false })
    lastname!: ICryptage;
  
    @Column({name: 'firstname', type: 'jsonb', nullable: false })
    firstname!: ICryptage;
  
    @Column({name: 'adresse', type: 'jsonb', nullable: false })
    adresse!: ICryptage;
  
    @Column({name: 'partage', type: 'boolean', nullable: false, default: true })
    partage!: boolean;
  
    @CreateDateColumn({name: 'createdAt', type: 'timestamp with time zone' })
    createdAt!: Date;
  
    @UpdateDateColumn({name: 'updateAt', type: 'timestamp with time zone' })
    updatedAt!: Date;
  
    @DeleteDateColumn({name: 'deletedAt', type: 'timestamp with time zone' })
    deletedAt!: Date;
  
  } 