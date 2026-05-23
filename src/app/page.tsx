import {
  Clock3,
  Globe2,
  ShieldCheck,
  Sparkles,
  Plane,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";

import { SearchForm } from "@/components/flight/search-form";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    icon: Globe2,
    title: "Worldwide Routes",
    description:
      "Search and manage flights across multiple destinations with realtime availability.",
  },

  {
    icon: Clock3,
    title: "Realtime Updates",
    description:
      "Seats update instantly across devices using live realtime synchronization.",
  },

  {
    icon: ShieldCheck,
    title: "Secure Booking",
    description:
      "Production-grade seat locking and protected booking architecture.",
  },
];

const stats = [
  {
    value: "120+",
    label: "Daily Flights",
  },

  {
    value: "50K+",
    label: "Passengers",
  },

  {
    value: "99.9%",
    label: "Realtime Accuracy",
  },

  {
    value: "24/7",
    label: "Support",
  },
];

export default function HomePage() {
  return (
    <AppLayout>
      <main className="relative overflow-hidden">
        {/* background effects */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%)]" />

        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        {/* HERO */}

        <section className="relative">
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm text-blue-300 backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />

              Realtime Flight Management Platform
            </div>

            <h1 className="mt-8 max-w-6xl text-5xl font-black leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
              The Future of
              <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Smart Airline{" "}
              </span>
              Booking
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-gray-400 md:text-xl">
              Experience realtime seat
              selection, secure booking,
              rescheduling, offline access,
              and a premium next-generation
              airline platform built for
              modern travelers.
            </p>

            <SearchForm />

            <div className="mt-14 grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  className="border-white/10 bg-white/5 backdrop-blur-xl"
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="text-3xl font-black text-blue-400">
                      {stat.value}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}

        <section className="relative py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-black md:text-5xl">
                Why Choose SkyLine
              </h2>

              <p className="mt-5 text-lg text-gray-400">
                Built with realtime
                architecture, premium UX,
                and modern aviation booking
                experiences.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card
                    key={feature.title}
                    className="group border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/20 hover:bg-white/10"
                  >
                    <CardContent className="p-8">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                        <Icon className="h-7 w-7 text-blue-400" />
                      </div>

                      <h3 className="mt-6 text-2xl font-bold">
                        {feature.title}
                      </h3>

                      <p className="mt-4 leading-relaxed text-gray-400">
                        {
                          feature.description
                        }
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}

        <section className="relative py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
                Premium Experience
              </div>

              <h2 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
                Designed for
                <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {" "}
                  Modern Travelers
                </span>
              </h2>

              <div className="mt-8 space-y-5">
                {[
                  "Realtime seat synchronization",
                  "Secure booking architecture",
                  "Offline access with PWA support",
                  "Lightning-fast search experience",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-cyan-400" />

                    <p className="text-gray-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <Button className="mt-10 h-12 px-8 text-base">
                Explore Flights

                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[40px] bg-blue-500/20 blur-3xl" />

              <div className="relative rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div>
                    <p className="text-sm text-gray-400">
                      Flight
                    </p>

                    <h3 className="mt-1 text-2xl font-bold">
                      SK102
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-blue-500/10 p-4">
                    <Plane className="h-8 w-8 text-blue-400" />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-6 gap-3">
                  {Array.from({
                    length: 30,
                  }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-10 rounded-xl ${
                        i % 7 === 0
                          ? "bg-red-500/30"
                          : i % 5 === 0
                          ? "bg-blue-500"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Selected Seat
                    </p>

                    <h4 className="mt-1 text-xl font-bold">
                      12A
                    </h4>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">
                      Price
                    </p>

                    <h4 className="mt-1 text-2xl font-black text-blue-400">
                      ₹6,500
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="relative py-24">
          <div className="mx-auto max-w-5xl px-4">
            <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-linear-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 p-10 text-center backdrop-blur-xl md:p-16">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_60%)]" />

              <div className="relative">
                <h2 className="text-4xl font-black md:text-6xl">
                  Ready to Fly Smarter?
                </h2>

                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
                  Join thousands of travelers
                  using realtime airline
                  technology with SkyLine.
                </p>

                <Button className="mt-10 h-12 px-10 text-base">
                  Get Started Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}