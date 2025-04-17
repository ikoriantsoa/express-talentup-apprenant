import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('controles_webinaires')
export class TalentupWebinaireControle {
  @PrimaryGeneratedColumn('uuid')
  controle_webinaire_id!: string;

  @Column()
  keycloak_id!: string;

  @Column()
  webinaire_id!: string;
}
