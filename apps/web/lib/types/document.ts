// lib/types/document.ts
export type Document = {
    id: string;
    title: string;
    description?: string;
    content?: string;
    file_path?: string;
    file_size?: number;
    file_url?: string;
    mimeType: string;
    createdByName: string;
    categoryName: string;
    categoryId?: string;
    categorySlug?: string;
    created_at: string;
    updated_at: string;
    likeCount: number;
    ratingCount: number;
    view: number;
    rating: number;
    thumbnailUrl?: string;
    accessType: AccessType;
    status?: string;
    rejection_reason?: string;
    reviewed_by?: string;
    reviewed_at?: string;
    source?: string;
    group_id?: string;
    tags?: string[];
    last_edited_by?: string;
    last_edited_at?: string;
    language?: string;
    version?: string;
};

export interface GetDocumentsResponse {
    data: Document[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export interface SearchResultItem {
    document: Document
    relevance: number
    matches: {
      field: string
      contexts: string[]
    }[]
  }
  

export type AccessType = "PRIVATE" | "PUBLIC" | "GROUP"
