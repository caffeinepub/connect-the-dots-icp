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
export interface HomePageLink {
    id: string;
    url: string;
    title: string;
    thumbnail: ExternalBlob;
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
export interface MissionContent {
    title: string;
    description: string;
    images: Array<ExternalBlob>;
}
export interface Spotlight {
    id: string;
    title: string;
    content: string;
    link?: string;
    timestamp: Time;
    image?: ExternalBlob;
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
    addHomePageLink(title: string, url: string, thumbnail: ExternalBlob): Promise<void>;
    addResource(name: string, description: string, url: string): Promise<void>;
    addSpotlight(title: string, content: string, image: ExternalBlob | null, link: string | null): Promise<void>;
    addWisdom(quote: string, author: string): Promise<void>;
    addXPost(description: string, image: ExternalBlob): Promise<void>;
    deleteArticle(id: string): Promise<boolean>;
    deleteCybercrimeArticle(id: string): Promise<boolean>;
    deleteHomePageLink(id: string): Promise<boolean>;
    deleteResource(id: string): Promise<boolean>;
    deleteSpotlight(id: string): Promise<boolean>;
    deleteWisdom(id: string): Promise<boolean>;
    deleteXPost(id: string): Promise<boolean>;
    getAllArticles(): Promise<Array<Article>>;
    getAllCybercrimeArticles(): Promise<Array<Article>>;
    getAllHomePageLinks(): Promise<Array<HomePageLink>>;
    getAllResources(): Promise<Array<Resource>>;
    getAllSpotlights(): Promise<Array<Spotlight>>;
    getAllWisdom(): Promise<Array<Wisdom>>;
    getAllXPosts(): Promise<Array<XPost>>;
    getArticlesSortedByTitle(): Promise<Array<Article>>;
    getMissionContent(): Promise<MissionContent | null>;
    updateArticle(id: string, title: string, url: string, thumbnail: ExternalBlob): Promise<boolean>;
    updateCybercrimeArticle(id: string, title: string, url: string, thumbnail: ExternalBlob): Promise<boolean>;
    updateHomePageLink(id: string, title: string, url: string, thumbnail: ExternalBlob): Promise<boolean>;
    updateMissionContent(title: string, description: string, images: Array<ExternalBlob>): Promise<void>;
    updateResource(id: string, name: string, description: string, url: string): Promise<boolean>;
    updateSpotlight(id: string, title: string, content: string, image: ExternalBlob | null, link: string | null): Promise<boolean>;
    updateWisdom(id: string, quote: string, author: string): Promise<boolean>;
    updateXPost(id: string, description: string, image: ExternalBlob): Promise<boolean>;
}
