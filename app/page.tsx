'use client';

import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"] });

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

export default function Page() {
  return (
    <div className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <nav className="nav">
        <div className="brand">
          <span className="brand-dot" />
          StackFlow
        </div>
        <div className="nav-actions">
          <button className="btn btn-ghost">Log in</button>
          <button className="btn btn-solid">Sign up</button>
        </div>
      </nav>

      <section className="hero">
        <div>
          <div className="eyebrow-line">
            <span className="rule" />
            a place to get unstuck
          </div>
          <h1>
            Ask a question.
            <br />
            Get a real <em>answer.</em>
          </h1>
          <p className="lede">
            StackFlow is where developers post the problem they&apos;re stuck on and get answers from
            people who&apos;ve solved it before — no forums to dig through, no threads to lose track of.
          </p>
          <div className="hero-cta">
            <button className="btn btn-solid btn-lg">Ask a question</button>
            <button className="btn btn-ghost btn-lg">Browse questions</button>
          </div>
        </div>

        <div className="stack">
          <div className="qcard">
            <p className="qcard-title">Why does useEffect run twice in React 18 dev mode?</p>
            <div className="qcard-meta">
              <span className="qcard-tag">react</span>
              <span className="qcard-answered">
                <span className="ring" />
                Answered
              </span>
            </div>
          </div>
          <div className="qcard">
            <p className="qcard-title">Best way to index a JSONB column in PostgreSQL?</p>
            <div className="qcard-meta">
              <span className="qcard-tag">postgresql</span>
              <span className="qcard-answered">
                <span className="ring" />
                Answered
              </span>
            </div>
          </div>
          <div className="qcard">
            <p className="qcard-title">Docker container can&apos;t reach host on Mac — fix?</p>
            <div className="qcard-meta">
              <span className="qcard-tag">docker</span>
              <span style={{ color: "var(--text-dim)", fontWeight: 500 }}>3 answers</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guidelines">
        <h2>Before you post</h2>
        <p className="sub">
          A few ground rules keep answers findable and worth trusting. They apply the same way to
          every question and every answer.
        </p>

        <div className="rules">
          {[
            ["01", "Search first", "Check if your question has already been answered before posting a duplicate."],
            ["02", "Be specific", "Include what you tried, the error you got, and the environment it happened in."],
            ["03", "Answer the question asked", "Solve the actual problem, not the problem you assume they meant."],
            ["04", "Show your reasoning", "A working snippet with no explanation helps less than you'd think."],
            ["05", "No personal attacks", "Critique code and ideas, never the person who posted them."],
            ["06", "Mark it resolved", "If an answer fixed it, accept it so the next person finds it faster."],
          ].map(([mark, title, body]) => (
            <div className="rule" key={mark}>
              <span className="rule-mark">{mark}</span>
              <div className="rule-body">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        :root {
          --ink: #10161d;
          --surface: #161e27;
          --surface-2: #1d2731;
          --line: #2a3540;
          --text: #e7ebee;
          --text-dim: #93a1ac;
          --amber: #f2b705;
          --teal: #49c9b8;
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        * {
          box-sizing: border-box;
        }
        html {
          scroll-padding-top: env(safe-area-inset-top, 0px);
        }
        html,
        body {
          height: 100%;
        }
        body {
          margin: 0;
          background: var(--ink);
          color: var(--text);
          font-family: var(--font-inter), -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        h1,
        h2,
        .brand,
        .btn,
        .qcard-tag {
          font-family: var(--font-space-grotesk), var(--font-inter), sans-serif;
        }

        .nav {
          position: sticky;
          top: 0;
          top: env(safe-area-inset-top, 0px);
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 6vw;
          background: rgba(16, 22, 29, 0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .brand {
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: -0.01em;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-dot {
          width: 9px;
          height: 9px;
          border-radius: 2px;
          background: var(--amber);
          display: inline-block;
          transform: rotate(45deg);
        }
        .nav-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .btn {
          font-size: 0.92rem;
          font-weight: 600;
          border-radius: 7px;
          padding: 9px 18px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
        }
        .btn:active {
          transform: translateY(1px);
        }
        .btn-ghost {
          background: transparent;
          color: var(--text);
          border-color: var(--line);
        }
        .btn-ghost:hover {
          border-color: var(--text-dim);
        }
        .btn-solid {
          background: var(--amber);
          color: #1a1400;
        }
        .btn-solid:hover {
          background: #ffc61a;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 4vw;
          align-items: center;
          max-width: 1180px;
          margin: 0 auto;
          padding: 8vh 6vw 7vh;
        }
        .eyebrow-line {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--teal);
          font-size: 0.85rem;
          margin-bottom: 18px;
          opacity: 0;
          animation: rise 0.6s ease forwards 0.05s;
        }
        .eyebrow-line .rule {
          width: 28px;
          height: 1px;
          background: var(--teal);
          display: inline-block;
        }
        h1 {
          font-size: clamp(2.3rem, 4.4vw, 3.4rem);
          line-height: 1.08;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 20px;
          opacity: 0;
          animation: rise 0.7s ease forwards 0.15s;
        }
        h1 em {
          font-style: normal;
          color: var(--amber);
        }
        .hero p.lede {
          font-size: 1.08rem;
          line-height: 1.65;
          color: var(--text-dim);
          max-width: 46ch;
          margin: 0 0 34px;
          opacity: 0;
          animation: rise 0.7s ease forwards 0.28s;
        }
        .hero-cta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          opacity: 0;
          animation: rise 0.7s ease forwards 0.4s;
        }
        .btn-lg {
          padding: 13px 24px;
          font-size: 0.98rem;
        }
        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stack {
          position: relative;
          height: 360px;
        }
        .qcard {
          position: absolute;
          left: 0;
          right: 0;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 16px 18px;
          box-shadow: 0 14px 30px -14px rgba(0, 0, 0, 0.6);
          opacity: 0;
          transform: translateY(24px);
          animation: cardIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .qcard:nth-child(1) {
          top: 0;
          z-index: 3;
          animation-delay: 0.5s;
        }
        .qcard:nth-child(2) {
          top: 118px;
          z-index: 2;
          animation-delay: 0.65s;
        }
        .qcard:nth-child(3) {
          top: 236px;
          z-index: 1;
          animation-delay: 0.8s;
        }
        @keyframes cardIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .qcard-title {
          font-size: 0.98rem;
          font-weight: 600;
          margin: 0 0 8px;
          color: var(--text);
        }
        .qcard-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
          color: var(--text-dim);
        }
        .qcard-answered {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--teal);
          font-weight: 600;
        }
        .qcard-answered .ring {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 0 3px rgba(73, 201, 184, 0.18);
        }
        .qcard-tag {
          background: var(--surface-2);
          border: 1px solid var(--line);
          color: var(--text-dim);
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: 5px;
        }

        .guidelines {
          max-width: 1180px;
          margin: 0 auto;
          padding: 4vh 6vw 10vh;
          border-top: 1px solid var(--line);
        }
        .guidelines h2 {
          font-size: 1.6rem;
          font-weight: 600;
          margin: 40px 0 8px;
          letter-spacing: -0.01em;
        }
        .guidelines .sub {
          color: var(--text-dim);
          margin: 0 0 34px;
          max-width: 60ch;
          font-size: 0.98rem;
        }
        .rules {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 0;
          border-top: 1px solid var(--line);
        }
        .rule {
          padding: 22px 0;
          border-bottom: 1px solid var(--line);
          display: flex;
          gap: 16px;
        }
        .rules .rule:nth-child(odd) {
          padding-right: 24px;
          border-right: 1px solid var(--line);
        }
        .rule-mark {
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 0.85rem;
          color: var(--amber);
          padding-top: 2px;
          flex-shrink: 0;
          width: 22px;
        }
        .rule-body h3 {
          margin: 0 0 6px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
        }
        .rule-body p {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--text-dim);
        }

        @media (max-width: 860px) {
          .hero {
            grid-template-columns: 1fr;
            padding-top: 5vh;
          }
          .stack {
            height: 320px;
            order: -1;
            margin-bottom: 6px;
          }
          .rules .rule:nth-child(odd) {
            border-right: none;
            padding-right: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .eyebrow-line,
          h1,
          .hero p.lede,
          .hero-cta,
          .qcard {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
