import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index } from "typeorm";
import { SocialLink } from "./SocialLink";

@Entity()
export class Creator {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column("varchar")
    alias: string; // identificador único e memorável ("arroba")

    @Column("text")
    description: string;

    @Column("text")
    about: string; // descrição mais longa. TODO: aceitar markdown

    @ManyToMany(type => SocialLink)
    @JoinTable({ name: "creator_links" })
    links: Array<SocialLink>;
}