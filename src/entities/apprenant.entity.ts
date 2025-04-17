import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { decrypt, encrypt } from "../cryptage/Cryptage";
import { TalentupWebinaire } from "./webinaire.entity";

@Entity("talentapprenant")
export class TalentApprenant {
  @PrimaryColumn('varchar')
  keycloakId!: string;

  @Column({ type: "varchar", nullable: false })
  nom!: string;

  @Column({ type: "varchar", nullable: false })
  prenom!: string;

  @Column({ type: "varchar", nullable: false })
  date_naissance!: string;

  @Column({ type: "varchar", nullable: false })
  telephone!: string;

  @Column({ type: "varchar", nullable: false })
  ville!: string;

  @Column({ type: "varchar", nullable: false })
  niveau_etude!: string;

  @Column({ type: "varchar", nullable: false })
  specialite!: string;

  @Column({ type: "varchar", nullable: true })
  cv?: string | null;

  @Column({ type: "varchar", nullable: true })
  photo?: string | null;

  @Column({ type: "varchar", nullable: false })
  presentation!: string;

  @Column({ type: "varchar", nullable: true })
  linkedin?: string;

  @Column({ type: "varchar", nullable: true })
  portfolio?: string;

  @Column({type: "boolean", nullable: false, default: true})
  partage!: boolean;

  @OneToMany(() => TalentupWebinaire, (webinaire) => webinaire.apprenant)
  webinaire!: TalentupWebinaire[];

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

  @BeforeInsert()
  @BeforeUpdate()
  encryptFields() {
    if (this.nom) {
      this.nom = encrypt(this.nom);
    }

    if (this.prenom) {
      this.prenom = encrypt(this.prenom);
    }

    if (this.date_naissance) {
      this.date_naissance = encrypt(this.date_naissance);
    }

    if (this.telephone) {
      this.telephone = encrypt(this.telephone);
    }

    if (this.ville) {
      this.ville = encrypt(this.ville);
    }

    if (this.niveau_etude) {
      this.niveau_etude = encrypt(this.niveau_etude);
    }

    if (this.specialite) {
      this.specialite = encrypt(this.specialite);
    }

    if (this.cv) {
      this.cv = encrypt(this.cv);
    }

    if (this.photo) {
      this.photo = encrypt(this.photo);
    }

    if (this.presentation) {
      this.presentation = encrypt(this.presentation);
    }

    if (this.linkedin) {
      this.linkedin = encrypt(this.linkedin);
    }

    if (this.portfolio) {
      this.portfolio = encrypt(this.portfolio);
    }
  }

  @AfterLoad()
  decryptFields() {
    if (this.nom) {
      this.nom = decrypt(this.nom);
    }

    if (this.prenom) {
      this.prenom = decrypt(this.prenom);
    }

    if (this.date_naissance) {
      this.date_naissance = decrypt(this.date_naissance);
    }

    if (this.telephone) {
      this.telephone = decrypt(this.telephone);
    }

    if (this.ville) {
      this.ville = decrypt(this.ville);
    }

    if (this.niveau_etude) {
      this.niveau_etude = decrypt(this.niveau_etude);
    }

    if (this.specialite) {
      this.specialite = decrypt(this.specialite);
    }
    
    if (this.cv) {
      this.cv = decrypt(this.cv);
    }

    if (this.photo) {
      this.photo = decrypt(this.photo);
    }

    if (this.presentation) {
      this.presentation = decrypt(this.presentation);
    }

    if (this.linkedin) {
      this.linkedin = decrypt(this.linkedin);
    }

    if (this.portfolio) {
      this.portfolio = decrypt(this.portfolio);
    }
  }
}
