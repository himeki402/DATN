import { Category } from "@/lib/types/category";
import { AccessType, Document, DocumentStats } from "@/lib/types/document";
import { Group } from "@/lib/types/group";
import { Tag } from "@/lib/types/tag";
import { User, UserStats } from "@/lib/types/user";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import documentApi from "@/lib/apis/documentApi";
import categoriesApi from "@/lib/apis/categoriesApi";
import tagApi from "@/lib/apis/tagApi";
import { toast } from "sonner";
import groupApi from "@/lib/apis/groupApi";
import userApi from "@/lib/apis/userApi";

interface AdminContextType {
    //documents
    documents: Document[];
    setDocuments: (documents: Document[]) => void;
    filteredDocuments: Document[];
    setFilteredDocuments: (documents: Document[]) => void;
    selectedDocument: Document | null;
    setSelectedDocument: (document: Document | null) => void;
    pendingDocuments: Document[];
    setPendingDocuments: (documents: Document[]) => void;
    documentStats: DocumentStats;
    setDocumentStats: (documentStats: DocumentStats) => void;

    //Users
    users: User[];
    setUsers: (users: User[]) => void;
    userStats: UserStats;
    setUserStats: (userStats: UserStats) => void;

    //Categories
    categories: Category[];
    setCategories: (categories: Category[]) => void;

    //Tags
    tags: Tag[];
    setTags: (tags: Tag[]) => void;

    // Group
    groups: Group[];
    setGroups: (groups: Group[]) => void;

    //Filters
    filters: {
        accessType: AccessType | "all";
        category: string | "all";
        tag: string | "all";
        group: string | "all";
    };
    setFilters: (filters: {
        accessType?: AccessType | "all";
        category?: string | "all";
        tag?: string | "all";
        group?: string | "all";
    }) => void;

    // Current user
    currentUser: User;
    // Pagination
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    setPagination: (pagination: {
        pageIndex?: number;
        pageSize?: number;
    }) => void;
    totalDocuments: number;
    setTotalDocuments: (total: number) => void;
    totalPendingDocuments: number;
    setTotalPendingDocuments: (total: number) => void;
    // Modals
    isDocumentModalOpen: boolean;
    setIsDocumentModalOpen: (isOpen: boolean) => void;
    isShareModalOpen: boolean;
    setIsShareModalOpen: (isOpen: boolean) => void;
    isVersionModalOpen: boolean;
    setIsVersionModalOpen: (isOpen: boolean) => void;
    isDetailsModalOpen: boolean;
    setIsDetailsModalOpen: (isOpen: boolean) => void;
    isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    // Document state
    const [documents, setDocuments] = useState<Document[]>([]);
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(
        null
    );
    const [documentStats, setDocumentStats] = useState<DocumentStats>(
        {} as DocumentStats
    );
    const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
    // User state
    const [users, setUsers] = useState<User[]>([]);
    const [userStats, setUserStats] = useState<UserStats>({} as UserStats);
    // Category state
    const [categories, setCategories] = useState<Category[]>([]);
    // Tag state
    const [tags, setTags] = useState<Tag[]>([]);
    // Group state
    const [groups, setGroups] = useState<Group[]>([]);
    // Modal state
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [totalPendingDocuments, setTotalPendingDocuments] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    //Current user
    const { user } = useAuth();
    const currentUser = user as User;

    // Pagination state
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // filters state
    const [filters, setFilters] = useState({
        accessType: "all" as AccessType | "all",
        category: "all" as string | "all",
        tag: "all" as string | "all",
        group: "all" as string | "all",
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const documentsResponse = await documentApi.getAllDocuments({
                    page: pagination.pageIndex + 1,
                    limit: pagination.pageSize,
                    accessType: filters.accessType,
                    categoryId: filters.category,
                    tag: filters.tag,
                    group: filters.group,
                });
                setDocuments(documentsResponse.data);
                setFilteredDocuments(documentsResponse.data);
                setTotalDocuments(documentsResponse.meta.total);

                const pendingResponse = await documentApi.getPendingDocuments({
                    page: 1,
                    limit: 4,
                });
                setPendingDocuments(pendingResponse.data);
                setTotalPendingDocuments(pendingResponse.meta.total);

                const documentStatsResponse =
                    await documentApi.getDocumentStats();
                setDocumentStats(documentStatsResponse.data);

                const categoriesResponse =
                    await categoriesApi.getCategoriesforAdmin();
                setCategories(categoriesResponse.data);

                const usersResponse = await userApi.getAllUsers({ limit: 10 });
                setUsers(usersResponse.data);

                const userStatsResponse = await userApi.getUsersStats();
                setUserStats(userStatsResponse.data);

                const tagsResponse = await tagApi.getAllTags();
                setTags(tagsResponse.data);

                const groupsResponse = await groupApi.getAllGroup();
                setGroups(groupsResponse.data);
            } catch (error) {
                console.error("Gặp lỗi khi tải dữ liệu ban đầu:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchFilteredDocuments = async () => {
            setIsLoading(true);
            try {
                const response = await documentApi.getAllDocuments({
                    page: pagination.pageIndex + 1,
                    limit: pagination.pageSize,
                    accessType: filters.accessType,
                    categoryId: filters.category,
                    tag: filters.tag,
                    group: filters.group,
                });
                setFilteredDocuments(response.data);
                setTotalDocuments(response.meta.total);
            } catch (error: any) {
                console.error("Lỗi khi lấy tài liệu đã lọc:", error);
                toast.error(error.message || "Không thể lấy tài liệu");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilteredDocuments();
    }, [filters, pagination]);

    const updatePagination = (newPagination: {
        pageIndex?: number;
        pageSize?: number;
    }) => {
        setPagination({ ...pagination, ...newPagination });
    };

    const updateFilters = (newFilters: {
        accessType?: AccessType | "all";
        category?: string | "all";
        tag?: string | "all";
        group?: string | "all";
    }) => {
        setFilters({ ...filters, ...newFilters });
        setPagination({ ...pagination, pageIndex: 0 });
    };

    return (
        <AdminContext.Provider
            value={{
                // Documents
                documents,
                setDocuments,
                filteredDocuments,
                setFilteredDocuments,
                pendingDocuments,
                setPendingDocuments,
                totalPendingDocuments,
                setTotalPendingDocuments,
                selectedDocument,
                setSelectedDocument,
                totalDocuments,
                setTotalDocuments,
                isLoading,
                documentStats,
                setDocumentStats,

                // Users
                users,
                setUsers,
                userStats,
                setUserStats,

                // Categories
                categories,
                setCategories,

                // Tags
                tags,
                setTags,

                // Groups
                groups,
                setGroups,

                // Search and filters
                filters,
                setFilters: updateFilters,

                // Pagination
                pagination,
                setPagination: updatePagination,

                // Modals
                isDocumentModalOpen,
                setIsDocumentModalOpen,
                isShareModalOpen,
                setIsShareModalOpen,
                isVersionModalOpen,
                setIsVersionModalOpen,
                isDetailsModalOpen,
                setIsDetailsModalOpen,

                // Current user
                currentUser,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminContext() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error(
            "useAdminContext phải được sử dụng trong AdminProvider"
        );
    }
    return context;
}
