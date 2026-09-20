import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { tablesDB } from "@/models/server/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import slugify from "@/utils/slugify";
import { storage } from "@/models/client/config";
import HeroSectionHeader from "./HeroSectionHeader";

export default async function HeroSection() {
    const questions = await tablesDB.listRows(db, questionCollection, [
        Query.orderDesc("$createdAt"),
        Query.limit(15),
    ]);

    return (
        <HeroParallax
            header={<HeroSectionHeader />}
            products={questions.rows.map(q => ({
                title: q.title,
                link: `/questions/${q.$id}/${slugify(q.title)}`,
                thumbnail: storage.getFilePreview(questionAttachmentBucket, q.attachmentId),
            }))}
        />
    );
}
