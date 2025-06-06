"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import documentApi from "@/lib/apis/documentApi";

interface SearchFiltersProps {
    availableCategories?: Category[];
}

interface Category {
    id: string;
    name: string;
}

export function SearchFilters({ availableCategories }: SearchFiltersProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>(availableCategories ?? []);
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get("category") || "all"
    );
    const [selectedSortBy, setSelectedSortBy] = useState(
        searchParams.get("sortBy") || "relevance"
    );
    const [selectedSortOrder, setSelectedSortOrder] = useState(
        searchParams.get("sortOrder") || "DESC"
    );

    useEffect(() => {
        if (availableCategories && availableCategories.length > 0) {
            setCategories(availableCategories);
        } else {
            const fetchCategories = async () => {
                try {
                    const query = searchParams.get("q") || "";
                    const response = await documentApi.getSearchCategories(query);
                    setCategories(response);
                } catch (error) {
                    console.error("Error fetching categories:", error);
                }
            };
            fetchCategories();
        }
    }, [availableCategories, searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);

        if (selectedCategory && selectedCategory !== "all") {
            params.set("category", selectedCategory);
        } else {
            params.delete("category");
        }

        params.set("sortBy", selectedSortBy);
        params.set("sortOrder", selectedSortOrder);
        params.set("page", "1"); // Reset to first page when filters change

        router.push(`/search?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("category");
        params.set("sortBy", "relevance");
        params.set("sortOrder", "desc");
        params.set("page", "1");

        setSelectedCategory("all");
        setSelectedSortBy("relevance");
        setSelectedSortOrder("desc");

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Bộ lọc tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Category Filter */}
                    <div className="space-y-2">
                        <Label>Danh mục</Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tất cả danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tất cả danh mục
                                </SelectItem>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Options */}
                    <div className="space-y-2">
                        <Label>Sắp xếp theo</Label>
                        <Select
                            value={selectedSortBy}
                            onValueChange={setSelectedSortBy}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn tiêu chí sắp xếp" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="relevance">
                                    Độ liên quan
                                </SelectItem>
                                <SelectItem value="created_at">
                                    Ngày tạo
                                </SelectItem>
                                <SelectItem value="views">
                                    Lượt xem
                                </SelectItem>
                                <SelectItem value="pageCount">
                                    Số trang
                                </SelectItem>
                                <SelectItem value="title">
                                    Tên tài liệu
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Thứ tự</Label>
                        <RadioGroup
                            value={selectedSortOrder}
                            onValueChange={setSelectedSortOrder}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="DESC" id="desc" />
                                <Label htmlFor="desc">Giảm dần</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ASC" id="asc" />
                                <Label htmlFor="asc">Tăng dần</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="flex gap-2">
                        <Button className="flex-1" onClick={applyFilters}>
                            Áp dụng
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={clearFilters}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
