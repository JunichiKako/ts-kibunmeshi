"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { client } from "@/libs/client";
import "./recipes.css";
import Loading from "../components/Loading/Loading";

// レスポンスの型を定義する
type recipes = {
    id: string;
    title: string;
    recipes: {
        img: { url: string };
    }[];
};

type recipesResponse = {
    contents: recipes[];
    // 必要に応じて他のプロパティも追加
};

export default function Recipes() {
    const [recipes, setRecipes] = useState<recipesResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 9; // 1ページあたりのレシピ数

    useEffect(() => {
        async function fetchData() {
            try {
                // APIからデータを取得
                const response = await client.getList({
                    endpoint: "kibunmeshi",
                    contentId: "id",
                    queries: {
                        limit: recipesPerPage,
                        offset: (currentPage - 1) * recipesPerPage,
                    },
                });
                setRecipes(response);
                setLoading(false);
            } catch (error) {
                // エラーを処理
                setError(error as Error);
                setLoading(false);
            }
        }

        fetchData();
    }, [currentPage]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error</div>;
    }

    // 次のページへ移動したときにページのトップにスクロール
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    // ページネーション
    const renderPagiantion = () => {
        return (
            <div className="pagination">
                {currentPage > 1 && (
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        前のページ
                    </button>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                        !!(recipes && recipes.contents.length < recipesPerPage)
                    }
                >
                    次のページ
                </button>
            </div>
        );
    };

    return (
        <div className="main-content">
            <div className="recipes-title">#レシピ一覧</div>
            <div className="new-content grid">
                {recipes?.contents.map((content) => (
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
            {renderPagiantion()}
        </div>
    );
}
