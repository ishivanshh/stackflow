
"use client";

import React from "react";
import Link from "next/link";

import { ID, Models } from "appwrite";
import { IconTrash } from "@tabler/icons-react";

import { tablesDB } from "@/models/client/config";
import { commentCollection, db } from "@/models/name";

import { useAuthStore } from "@/store/Auth";

import { cn } from "@/lib/utils";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";


// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

interface CommentAuthor {
    $id: string;
    name: string;
    reputation?: number;
}


interface CommentRow extends Models.Row {
    content: string;

    authorId: string;

    questionId?: string;
    answerId?: string;

    author: CommentAuthor;
}


interface CommentsData {
    total: number;
    rows: CommentRow[];
}


// ---------------------------------------------------------
// Comments Component
// ---------------------------------------------------------

const Comments = ({
    comments: initialComments,
    type,
    typeId,
    className,
}: {
    comments: CommentsData;
    type: "question" | "answer";
    typeId: string;
    className?: string;
}) => {

    const [comments, setComments] =
        React.useState<CommentsData>(initialComments);

    const [newComment, setNewComment] =
        React.useState("");

    const [loading, setLoading] =
        React.useState(false);

    const { user } = useAuthStore();


    // -----------------------------------------------------
    // CREATE COMMENT
    // -----------------------------------------------------

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!newComment.trim() || !user || loading) {
            return;
        }

        setLoading(true);

        try {

            const response = await tablesDB.createRow(
                db,
                commentCollection,
                ID.unique(),
                {
                    content: newComment.trim(),

                    authorId: user.$id,

                    ...(type === "question"
                        ? {
                              questionId: typeId,
                          }
                        : {
                              answerId: typeId,
                          }),
                }
            );


            // -------------------------------------------------
            // Add newly-created comment to UI immediately
            // -------------------------------------------------

            const newCommentRow: CommentRow = {
                ...response,

                content: newComment.trim(),

                authorId: user.$id,

                ...(type === "question"
                    ? {
                          questionId: typeId,
                      }
                    : {
                          answerId: typeId,
                      }),

                author: user,
            };


            setComments((prev) => ({
                total: prev.total + 1,

                rows: [
                    newCommentRow,
                    ...prev.rows,
                ],
            }));


            setNewComment("");

        } catch (error: any) {

            window.alert(
                error?.message ||
                "Error creating comment"
            );

        } finally {

            setLoading(false);
        }
    };


    // -----------------------------------------------------
    // DELETE COMMENT
    // -----------------------------------------------------

    const deleteComment = async (
        commentId: string
    ) => {

        try {

            await tablesDB.deleteRow(
                db,
                commentCollection,
                commentId
            );


            setComments((prev) => ({
                total: Math.max(0, prev.total - 1),

                rows: prev.rows.filter(
                    (comment) =>
                        comment.$id !== commentId
                ),
            }));

        } catch (error: any) {

            window.alert(
                error?.message ||
                "Error deleting comment"
            );
        }
    };


    // -----------------------------------------------------
    // RENDER
    // -----------------------------------------------------

    return (
        <div
            className={cn(
                "flex flex-col gap-2 pl-4",
                className
            )}
        >

            {comments.rows.map((comment) => (

                <React.Fragment key={comment.$id}>

                    <hr className="border-white/40" />


                    <div className="flex gap-2">

                        <p className="text-sm">

                            {comment.content}{" "}

                            -{" "}


                            {/* -------------------------------------------------
                                Author
                            ------------------------------------------------- */}

                            <Link
                                href={`/users/${comment.authorId}/${slugify(
                                    comment.author.name
                                )}`}
                                className="text-orange-500 hover:text-orange-600"
                            >

                                {comment.author.name}

                            </Link>{" "}


                            {/* -------------------------------------------------
                                Time
                            ------------------------------------------------- */}

                            <span className="opacity-60">

                                {convertDateToRelativeTime(
                                    new Date(comment.$createdAt)
                                )}

                            </span>

                        </p>


                        {/* -------------------------------------------------
                            Delete button
                        ------------------------------------------------- */}

                        {user?.$id === comment.authorId ? (

                            <button
                                type="button"
                                onClick={() =>
                                    deleteComment(
                                        comment.$id
                                    )
                                }
                                className="shrink-0 text-red-500 hover:text-red-600"
                            >

                                <IconTrash className="h-4 w-4" />

                            </button>

                        ) : null}

                    </div>

                </React.Fragment>

            ))}


            <hr className="border-white/40" />


            {/* -------------------------------------------------
                Add comment
            ------------------------------------------------- */}

            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2"
            >

                <textarea
                    className="w-full rounded-md border border-white/20 bg-white/10 p-2 outline-none"
                    rows={1}
                    placeholder={
                        user
                            ? "Add a comment..."
                            : "Login to add a comment..."
                    }
                    value={newComment}
                    disabled={!user || loading}
                    onChange={(e) =>
                        setNewComment(
                            e.target.value
                        )
                    }
                />


                <button
                    type="submit"
                    disabled={
                        !user ||
                        !newComment.trim() ||
                        loading
                    }
                    className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    {loading
                        ? "Adding..."
                        : "Add Comment"}

                </button>

            </form>

        </div>
    );
};


export default Comments;
