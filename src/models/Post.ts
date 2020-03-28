import util from 'util';
import crypto from 'crypto';

export enum PostType {
    Video = 0,
    Podcast,
    Text
};

export enum SourceType {
    File = 0,
    Youtube
};

export declare interface PostMedia {
    Duration: number;
    FileSize: number;
    FileType: string;
    URL: string;
    Source: SourceType;
};

export declare interface Post {
    Timestamp: number;
    Title: string;
    Text: string;
    Summary: string;
    GUID: string;
    ImageURL: string;
    Tags: Array<string>;
    Type: PostType;
    Media: PostMedia;
};

// Checksum calcula um identificador para o post baseado no title, summary, imageURL, media.duration, media.url e media.fileSize
export function Checksum(p: Post): string {
    return crypto.createHash('sha256').update(
        util.format(
            "%s;%s;%s;%d;%s;%d",
            p.Title,
            p.Summary,
            p.ImageURL,
            p.Media.Duration,
            p.Media.URL,
            p.Media.FileSize,
        )
    ).digest('hex');
}
