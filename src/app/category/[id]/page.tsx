"use client";

import "./category.css";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { client } from "@/libs/client";
import Link from "next/link";
import Loading from "@/app/components/Loading/Loading";

const CategoryList = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        async function fetchCategory() {
            try {
                const response = await client.getList({
                    endpoint: "kibunmeshi",
                    queries: { filters: `category[equals]${id}` },
                });
                setData(response);
                console.log(response);
            } catch (error) {
                setError(error);
            }
            setLoading(false);
        }

        fetchCategory();
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // データが存在しない、またはcontents配列が空の場合の処理
    if (!data || !data.contents || data.contents.length === 0) {
        return <div>Recipe not found</div>;
    }

    // カテゴリー名を取得
    const categoryName = data.contents[0].category.title;

    // カテゴリー名に基づいて背景色をマッピング
    const categoryStyles = {
        あっさり: { backgroundColor: "#a7d1d1", color: "#fff" },
        さっぱり: { backgroundColor: "#ffb700", color: "#fff" },
        ガッツリ: { backgroundColor: "#e14b00", color: "#fff" },
        ぱぱっと: { backgroundColor: "#201e64", color: "#fff" },
    };

    return (
        <div className="categorydetail-content">
            <h2 className="category-title" style={categoryStyles[categoryName]}>
                #{categoryName}
            </h2>
            <div className="grid">
                {data.contents.map((content) => (
                    <div key={content.id} className="item">
                        <Link href={`/recipe/${content.id}`}>
                            {/* レシピの画像がある場合のみ表示 */}
                            {content.recipes[0] && content.recipes[0].img && (
                                <img
                                    src={content.recipes[0].img.url}
                                    alt={content.title}
                                />
                            )}
                            <p>{content.title}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
