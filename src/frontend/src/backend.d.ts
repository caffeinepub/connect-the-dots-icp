import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Article {
    id: string;
    url: string;
    title: string;
    thumbnail: ExternalBlob;
    timestamp: Time;
}
export interface Wisdom {
    id: string;
    quote: string;
    author: string;
    timestamp: Time;
}
export type Time = bigint;
export interface Resource {
    id: string;
    url: string;
    name: string;
    description: string;
}
export interface Spotlight {
    id: string;
    title: string;
    content: string;
    timestamp: Time;
}
export interface XPost {
    id: string;
    description: string;
    timestamp: Time;
    image: ExternalBlob;
}
export interface backendInterface {
    addArticle(title: string, url: string, thumbnail: ExternalBlob): Promise<void>;
    addCybercrimeArticle(title: string, url: string, thumbnail: ExternalBlob): Promise<void>;
    addResource(name: string, description: string, url: string): Promise<void>;
    addSpotlight(title: string, content: string): Promise<void>;
    addWisdom(quote: string, author: string): Promise<void>;
    addXPost(description: string, image: ExternalBlob): Promise<void>;
    getAllArticles(): Promise<Array<Article>>;
    getAllCybercrimeArticles(): Promise<Array<Article>>;
    getAllResources(): Promise<Array<Resource>>;
    getAllSpotlights(): Promise<Array<Spotlight>>;
    getAllWisdom(): Promise<Array<Wisdom>>;
    getAllXPosts(): Promise<Array<XPost>>;
    getArticlesSortedByTitle(): Promise<Array<Article>>;
}
