// components/home/NavigationMenuClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types/category";
import { Book, BookOpen, FileText, GraduationCap } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// Biểu tượng cho các danh mục con ngoại ngữ
const languageIcons: Record<string, string> = {
    "Tài liệu tiếng anh": "🇬🇧",
    "Tài liệu tiếng trung": "🇨🇳",
    "Tài liệu tiếng nhật": "🇯🇵",
    "Tài liệu tiếng hàn": "🇰🇷",
    "Tài liệu tiếng pháp": "🇫🇷",
    "Tài liệu tiếng đức": "🇩🇪",
};

interface NavigationMenuClientProps {
    categories: Category[];
}

export function NavigationMenuClient({ categories }: NavigationMenuClientProps) {
    const foreignLanguageCategory = categories.find((cat) =>
        cat.name.toLowerCase().includes("ngoại ngữ")
    );

    const examPrepCategory = categories.find((cat) =>
        cat.name.toLowerCase().includes("ôn thi")
    );

    const mainCategories = categories.filter(
        (cat) =>
            cat.id !== foreignLanguageCategory?.id &&
            cat.id !== examPrepCategory?.id
    );

    return (
        <NavigationMenu className="max-w-full w-full justify-center">
            <NavigationMenuList className="flex flex-wrap justify-center">
                {/* Các danh mục chính */}
                {mainCategories.map((category) => (
                    <NavigationMenuItem key={category.id}>
                        <Link
                            href={`/category/${category.slug}`}
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                
                                {category.name.toUpperCase()}
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                ))}

                {/* Danh mục NGOẠI NGỮ với các danh mục con */}
                {foreignLanguageCategory && (
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>                           
                            {foreignLanguageCategory.name.toUpperCase()}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {foreignLanguageCategory.children?.map(
                                    (language) => (
                                        <ListItem
                                            key={language.id}
                                            title={language.name}
                                            href={`/category/${language.slug}`}
                                            icon={
                                                languageIcons[
                                                    language.name.toLowerCase()
                                                ] || "🌐"
                                            }
                                        >
                                            {language.description ||
                                                `Tài liệu học ${language.name}`}
                                        </ListItem>
                                    )
                                )}
                                {(!foreignLanguageCategory.children ||
                                    foreignLanguageCategory.children.length ===
                                        0) && (
                                    <ListItem
                                        title={foreignLanguageCategory.name}
                                        href={`/category/${foreignLanguageCategory.slug}`}
                                        icon="🌐"
                                    >
                                        {foreignLanguageCategory.description ||
                                            "Tài liệu học ngoại ngữ các loại"}
                                    </ListItem>
                                )}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                )}

                {/* Danh mục TÀI LIỆU ÔN THI với các danh mục con */}
                {examPrepCategory && (
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            {examPrepCategory.name.toUpperCase()}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {examPrepCategory.children?.map((exam) => (
                                    <ListItem
                                        key={exam.id}
                                        title={exam.name}
                                        href={`/category/${exam.slug}`}
                                    >
                                        {exam.description ||
                                            `Tài liệu ôn thi ${exam.name}`}
                                    </ListItem>
                                ))}
                                {(!examPrepCategory.children ||
                                    examPrepCategory.children.length === 0) && (
                                    <ListItem
                                        title={examPrepCategory.name}
                                        href={`/category/${examPrepCategory.slug}`}
                                    >
                                        {examPrepCategory.description ||
                                            "Tài liệu ôn thi các loại"}
                                    </ListItem>
                                )}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
    title: string;
    href: string;
    icon?: React.ReactNode;
}

const ListItem = React.forwardRef<React.ComponentRef<"a">, ListItemProps>(
    ({ className, title, icon, children, href, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        href={href}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="flex items-center gap-2">
                            {icon && <span className="text-lg">{icon}</span>}
                            <span className="text-sm font-medium leading-none">
                                {title}
                            </span>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = "ListItem";