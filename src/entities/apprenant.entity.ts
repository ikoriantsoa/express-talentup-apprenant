import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { ICryptage } from "../cryptage/ICryptage";

@Entity("talentapprenant")
export class TalentApprenant {
  @PrimaryColumn('uuid')
  keycloakId!: string;

  @Column({ type: "jsonb", nullable: false })
  nom!: ICryptage;

  @Column({ type: "jsonb", nullable: false })
  prenom!: ICryptage;

  @Column({ type: "jsonb", nullable: false })
  date_naissance!: ICryptage;

  @Column({ type: "jsonb", nullable: false })
  telephone!: ICryptage;

  @Column({ type: "jsonb", nullable: false })
  ville!: ICryptage;

  @Column({ type: "jsonb", nullable: false })
  niveau_etude!: ICryptage;

  @Column({ type: "jsonb", nullable: false })
  specialite!: ICryptage;

  @Column({ type: "jsonb", nullable: true })
  cv?: ICryptage | null;

  @Column({ type: "jsonb", nullable: true })
  photo?: ICryptage | null;

  @Column({ type: "jsonb", nullable: false })
  presentation!: ICryptage;

  @Column({ type: "jsonb", nullable: true })
  linkedin?: ICryptage;

  @Column({ type: "jsonb", nullable: true })
  portfolio?: ICryptage;

  // @Column("simple-array", { nullable: false })
  // objectives!: string[];

  @Column({type: "boolean", nullable: false, default: true})
  partage!: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at!: Date | null;
}
