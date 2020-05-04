
import util from 'util';
import crypto from 'crypto';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index, OneToOne, JoinColumn } from "typeorm";

export enum PostType {
    Video = 0,
    Podcast,
    Text
};

export enum SourceType {
    File = 0,
    Youtube
};

// Checksum calcula um identificador para o post baseado no title, summary, imageURL, media.duration, media.url e media.fileSize
export function Checksum(p: Post): string {
    return crypto.createHash('sha256').update(
        util.format(
            "%s;%s;%s;%d;%s;%d",
            p.title,
            p.summary,
            p.imageUrl,
            p.media.duration,
            p.media.url,
            p.media.fileSize,
        )
    ).digest('hex');
}

@Entity()
export class PostMedia {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("float")
    duration: number;

    @Column("float")
    fileSize: number;

    @Column("varchar")
    fileType: string;

    @Column("varchar")
    url: string;

    @Column("enum", { enum: SourceType, nullable: false })
    source: SourceType;

    @OneToOne(type => Post, post => post.media)
    post: Post;
}

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column("varchar")
    slug: string; // identificador único e memorável ("arroba")

    @Column("varchar")
    title: string;

    @Column("text")
    text: string;

    @Column("text")
    summary: string;

    @Column("varchar")
    guid: string;

    @Column("varchar")
    imageUrl: string;

    @Column("varchar", { array: true })
    tags: Array<string>;

    @Column("enum", { enum: PostType, nullable: false })
    type: PostType;

    @OneToOne(type => PostMedia, postMedia => postMedia.post)
    @JoinColumn()
    media: PostMedia;
}
