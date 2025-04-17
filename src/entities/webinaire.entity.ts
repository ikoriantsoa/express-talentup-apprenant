import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TalentApprenant } from "./apprenant.entity";
import { decrypt, encrypt } from "../cryptage/Cryptage";

@Entity("webinaires")
export class TalentupWebinaire {
  @PrimaryGeneratedColumn("uuid")
  webinaireId!: string;

  @Column({ type: "varchar", nullable: false })
  titre!: string;

  @Column({ type: "varchar", nullable: false, default: `test` })
  categorie!: string;

  @Column({ type: "varchar", nullable: false })
  image!: string;

  @Column({ type: "varchar", nullable: false })
  source!: string;

  @Column({ type: "boolean", nullable: false, default: false })
  status!: boolean;

  @ManyToOne(() => TalentApprenant, (apprenant) => apprenant.webinaire)
  apprenant!: TalentApprenant;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp with time zone" })
  deletedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  encryptFields() {
    if (this.titre) {
      this.titre = encrypt(this.titre);
    }

    if (this.categorie) {
      this.categorie = encrypt(this.categorie);
    }

    if (this.image) {
      this.image = encrypt(this.image);
    }

    if (this.source) {
      this.source = encrypt(this.source);
    }
  }

  @AfterLoad()
  decryptFields() {
    if (this.titre) {
      this.titre = decrypt(this.titre);
    }

    if (this.categorie) {
      this.categorie = decrypt(this.categorie);
    }

    if (this.image) {
      this.image = decrypt(this.image);
    }

    if (this.source) {
      this.source = decrypt(this.source);
    }
  }
}
