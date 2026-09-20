
"use client";

import React from "react";
import { BorderBeam } from "./magicui/border-beam";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { normalizeTags } from "@/utils/tags";


// ---------------------------------------------------------
// Author type
// ---------------------------------------------------------

interface QuestionAuthor {
    $id: string;
    name: string;
    reputation: number;
}


// ---------------------------------------------------------
// Question Row type
// ---------------------------------------------------------

interface QuestionRow extends Models.Row {
    title: string;
    content: string;
    authorId: string;
    tags: string[];
    attachmentId?: string | null;

    totalVotes?: number;
    totalAnswers?: number;

    // Added/enriched by your question fetching layer
    author: QuestionAuthor;
}


// ---------------------------------------------------------
// Question Card
// ---------------------------------------------------------

const QuestionCard = ({
    ques,
}: {
    ques: QuestionRow;
}) => {

    const [height, setHeight] = React.useState(0);

    const ref = React.useRef<HTMLDivElement>(null);


    // -----------------------------------------------------
    // Calculate card height for BorderBeam
    // -----------------------------------------------------

    React.useEffect(() => {

        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }

    }, []);


    // -----------------------------------------------------
    // Render
    // -----------------------------------------------------

    return (
        <div
            ref={ref}
            className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/20 bg-white/5 p-4 duration-200 hover:bg-white/10 sm:flex-row"
        >

            <BorderBeam
                size={height}
                duration={12}
                delay={9}
            />


            {/* -------------------------------------------------
                Question statistics
            ------------------------------------------------- */}

            <div className="relative shrink-0 text-sm sm:text-right">

                <p>
                    {ques.totalVotes ?? 0} votes
                </p>

                <p>
                    {ques.totalAnswers ?? 0} answers
                </p>

            </div>


            {/* -------------------------------------------------
                Question content
            ------------------------------------------------- */}

            <div className="relative w-full">

                <Link
                    href={`/questions/${ques.$id}/${slugify(
                        ques.title
                    )}`}
                    className="text-orange-500 duration-200 hover:text-orange-600"
                >

                    <h2 className="text-xl">
                        {ques.title}
                    </h2>

                </Link>


                {/* -------------------------------------------------
                    Tags + Author
                ------------------------------------------------- */}

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">

                    {/* Tags */}

                    {normalizeTags(ques.tags).map(
                        (tag: string) => (

                            <Link
                                key={tag}
                                href={`/questions?tag=${tag}`}
                                className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
                            >
                                #{tag}
                            </Link>

                        )
                    )}


                    {/* -------------------------------------------------
                        Author
                    ------------------------------------------------- */}

                    <div className="ml-auto flex items-center gap-1">

                        <picture>

                            <img
                                src={avatars.getInitials(
                                    ques.author.name,
                                    24,
                                    24
                                )}
                                alt={ques.author.name}
                                className="rounded-lg"
                            />

                        </picture>


                        <Link
                            href={`/users/${ques.author.$id}/${slugify(
                                ques.author.name
                            )}`}
                            className="text-orange-500 hover:text-orange-600"
                        >

                            {ques.author.name}

                        </Link>


                        <strong>
                            &quot;{ques.author.reputation}&quot;
                        </strong>

                    </div>


                    {/* Asked time */}

                    <span>
                        asked{" "}
                        {convertDateToRelativeTime(
                            new Date(ques.$createdAt)
                        )}
                    </span>

                </div>

            </div>

        </div>
    );
};


export default QuestionCard;