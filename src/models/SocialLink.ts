import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


export enum LinkType {
    Website = 0,
    YouTube,
    Twitter,
    Facebook,
    Instagram,
    Lattes
}

@Entity({ name: "sociallink" })
export class SocialLink {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    url: string;

    @Column({
        type: "enum",
        enum: LinkType,
        default: LinkType.Website
    })
    type: LinkType;
}
