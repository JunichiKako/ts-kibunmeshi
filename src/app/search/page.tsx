"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { client } from "@/libs/client";
import { useSearchParams } from "next/navigation";
import "../main.css";
import "./search.css";

import SearchRecipe from "../components/SearchRecipe/SearchRecipe";
import Loading from "../components/Loading/Loading";
import { searchRecipe } from "../types/recipe";

export default function Page() {
    const searchParams = useSearchParams();
    const word = searchParams.get("word");
    const [searchResults, setSearchResults] = useState<searchRecipe[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleSearch = async () => {
            try {
                setLoading(true);
                const response = await client.getList({
                    endpoint: "kibunmeshi",
                    queries: { q: word as string },
                });

                setSearchResults(response.contents);
            } catch (error) {
                console.error("検索中にエラーが発生しました:", error);
            } finally {
                setLoading(false);
            }
        };

        handleSearch();
    }, [word]);

    if (loading) {
        return <Loading />; // ローディングコンポーネントを表示
    }

    return (
        <div className="main-content">
            <SearchRecipe />
            {/* 検索結果の表示 */}
            <div className="search-results">
                {searchResults.slice(0, 6).map((content) => (
                    <div key={content.id} className="item">
                        <Link href={`/recipe/${content.id}`}>
                            <img
                                src={content.recipes[0].img.url}
                                alt={content.title}
                            />
                            <p>{content.title}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
