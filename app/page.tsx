import { Feature } from "@/components/Feature";
import { Button } from "@/components/ui/button";
import { BarChart3, LayoutDashboard, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative py-32 text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-3xl" />
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Manage projects. <br />
          <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Ship faster.
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Taskify is a modern productivity platform built. Designed for teams
          who value clarity and performance.
        </p>

        <div className="flex justify-center gap-4 mt-10">
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700" size="lg">
              Start for Free
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Login
            </Button>
            {/* TODO: Kullanici login bile olsa anlik olarak login form gozukuyor,
            bunu duzelt */}
          </Link>
        </div>
      </section>

      <section className="px-6 py-24 border-t">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">
          <Feature
            icon={<LayoutDashboard size={28} />}
            title="Smart Dashboard"
            desc="Real-time overview of tasks and performance."
          />
          <Feature
            icon={<BarChart3 size={28} />}
            title="Analytics"
            desc="Track productivity and team efficiency."
          />
          <Feature
            icon={<Users size={28} />}
            title="Collaboration"
            desc="Assign tasks and work together seamlessly."
          />
          <Feature
            icon={<Shield size={28} />}
            title="Secure"
            desc="Built with Firebase authentication."
          />
        </div>
      </section>
    </div>
  );
}
