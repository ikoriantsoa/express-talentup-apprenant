import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("webinaires")
export class TalentupWebinaire {
  @PrimaryGeneratedColumn("uuid")
  webinaireid!: string;

  @Column({ type: "varchar", nullable: false })
  titre!: string;

  @Column({ type: "varchar", nullable: false, default: `test` })
  categorie!: string;

  @Column({
    type: "varchar",
    enum: ["Cours", "TP", "Projet"],
    nullable: false,
  })
  type!: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  niveau!: string;

  @Column({ type: "varchar", nullable: false })
  image!: string;

  @Column({ type: "varchar", nullable: false })
  source!: string;

  @Column({ type: "varchar", nullable: false })
  auteur!: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp with time zone" })
  deletedAt!: Date;
}
