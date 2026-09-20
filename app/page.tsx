
import { Globe } from "@/components/ui/globe";
import LatestQuestions from "./components/LatestQuestions";
import Footer from "./components/Footer";
import { AnimatedList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
import { MorphingText } from "@/components/ui/morphing-text"

const joinedUsers = [
  { name: "Shivansh Saxena", time: "just now", icon: "👤", color: "#00C9A7" },
  { name: "Rohit", time: "2m ago", icon: "✨", color: "#FFB800" },
  { name: "Sanyam Garg", time: "5m ago", icon: "🚀", color: "#FF3D71" },
  { name: "Priya Sharma", time: "8m ago", icon: "💬", color: "#1E86FF" },
];

const JoinedUser = ({
  name,
  time,
  icon,
  color,
}: (typeof joinedUsers)[number]) => (
  <figure
    className={cn(
      "relative mx-auto w-full max-w-[400px] overflow-hidden rounded-2xl p-4",
      "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "transition-all duration-200 ease-in-out hover:scale-[103%]",
      "dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
    )}
  >
    <div className="flex items-center gap-3">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: color }}
      >
        <span className="text-lg">{icon}</span>
      </div>
      <div className="min-w-0">
        <figcaption className="flex items-center gap-1 dark:text-white">
          <span className="truncate font-medium">{name}</span>
          <span className="text-gray-500">joined</span>
        </figcaption>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  </figure>
);

export default function Home() {
  return (
    <main className="w-full overflow-hidden">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-transparent">

      
        {/* GLOBE */}

        <Globe
          className="
            absolute
            top-1/2
            left-1/2
            z-0
            w-[min(92vw,900px)]
            !max-w-[900px]
            -translate-x-1/2
            -translate-y-1/2
          "
        />


        {/* HERO OVERLAY */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            bg-[radial-gradient(circle_at_50%_100%,rgba(0,0,0,0.25),transparent_60%)]
          "
        />


        {/* Bottom fade */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            z-30
            h-40
            w-full
            bg-gradient-to-t
            from-background
            to-transparent
          "
        />

      </section>


      {/* =====================================================
          SCROLL VELOCITY SECTION
      ===================================================== */}

      <section className="relative flex w-full items-center justify-center overflow-hidden py-20">

        <ScrollVelocityContainer
          className="
            w-full
            text-4xl
            font-bold
            tracking-[-0.02em]
            md:text-7xl
            md:leading-20
          "
        >

          <ScrollVelocityRow
            baseVelocity={20}
            direction={1}
          >
            BUILD • CREATE • DEPLOY • INNOVATE •
          </ScrollVelocityRow>


          <ScrollVelocityRow
            baseVelocity={20}
            direction={-1}
          >
            QUESTION • LIKE • COMMENT • ANSWER •
          </ScrollVelocityRow>

        </ScrollVelocityContainer>


        {/* Left fade */}

        <div
          className="
            from-background
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-10
            w-1/4
            bg-gradient-to-r
          "
        />


        {/* Right fade */}

        <div
          className="
            from-background
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-10
            w-1/4
            bg-gradient-to-l
          "
        />

      </section>


      {/* =====================================================
          ROTATING TECHNOLOGY ICONS
      ===================================================== */}

      <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden">

        {/* Background glow */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]
          "
        />


        {/* Heading */}

          <div className="absolute inset-x-0 top-12 z-20 flex justify-center text-center">

          <MorphingText
  texts={[
    "Hello",
    "नमस्ते",       // Hindi
    "নমস্কার",      // Bengali
    "নমস্কাৰ",      // Assamese
    "નમસ્તે",       // Gujarati
    "ನಮಸ್ಕಾರ",      // Kannada
    "നമസ്കാരം",      // Malayalam
    "ନମସ୍କାର",      // Odia
    "నమస్కారం",     // Telugu
    "நமஸ்காரம்",    // Tamil
    "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", // Punjabi
    "नमस्कार",      // Marathi
    "नमस्कार",      // Nepali
  ]}
/>

        </div>


        <div className="relative z-10 flex w-full max-w-3xl items-center justify-center px-4 pt-24">
          <Terminal className="w-full">
            <TypingAnimation>&gt; npm run dev @codeflow</TypingAnimation>

            <AnimatedSpan className="text-green-500">
              ✔ Post Your Doubts. Get Answers. Build Together. 
            </AnimatedSpan>
            <AnimatedSpan className="text-green-500">
              ✔ Contribute to the community. Share your knowledge.
            </AnimatedSpan>
            <AnimatedSpan className="text-green-500">
              ✔ Give Vote to the best answers. Help others learn.
            </AnimatedSpan>
            <AnimatedSpan className="text-green-500">
              ✔ Also  keep checking our latest features and updates
            </AnimatedSpan>
            <AnimatedSpan className="text-green-500">
              ✔ Your are good to go. Happy Contributing!
            </AnimatedSpan>
            <AnimatedSpan className="text-green-500">
              ✔ Installing dependencies.
            </AnimatedSpan>
            <AnimatedSpan className="text-blue-500">
              <span>ℹ Updated 1 file:</span>
              <span className="pl-2">- app/page.tsx</span>
            </AnimatedSpan>
            <TypingAnimation className="text-muted-foreground">
              Success! Check out the latest questions below.
            </TypingAnimation>
            <TypingAnimation className="text-muted-foreground">
              Fill Below to contribute in this project. Your contribution will be appreciated.
            </TypingAnimation>
          </Terminal>
        </div>

      </section>

      <section className="container mx-auto w-full px-4 py-20">
        <div className="mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Community
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
              Questions
            </h2>
          </div>
        </div>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="min-w-0">
            <LatestQuestions />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
            <div className="mb-4">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Growing together
              </p>
              <h3 className="mt-2 text-2xl font-semibold">Users joining Codeflow</h3>
            </div>
            <div className="relative h-[500px] overflow-hidden">
              <AnimatedList className="gap-4">
                {joinedUsers.map((user, index) => (
                  <JoinedUser {...user} key={`${user.name}-${index}`} />
                ))}
              </AnimatedList>
              <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t" />
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </main>
  );
}
