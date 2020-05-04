import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index } from "typeorm";
import { SocialLink } from "./SocialLink";


export enum ChannelType {
    Podcast = 0,
    Youtube
}

@Entity()
export class Channel {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column("varchar")
    alias: string; // identificador único e memorável ("arroba")

    @Column("enum", { enum: ChannelType, nullable: false })
    type: ChannelType;

    @Column("varchar")
    title: string | undefined | null;

    @Column("varchar")
    feedLocation: string | undefined | null;

    @Column("varchar")
    avatarUrl: string | undefined | null;

    @Column("varchar")
    bannerUrl: string | undefined | null;

    @Column("varchar")
    description: string | undefined | null;

    @Column("text")
    about: string | undefined | null; // descrição mais longa. TODO: aceitar markdown

    @Column("varchar", { array: true })
    keywords: Array<string> | undefined | null;

    @ManyToMany(type => SocialLink)
    @JoinTable({ name: "channel_links" })
    links: Array<SocialLink> | undefined | null;
}