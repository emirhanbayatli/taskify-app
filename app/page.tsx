import { Feature } from "@/components/Feature";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Shield,
  Users,
  ArrowRight,
  KanbanSquare,
  Zap,
  CheckCircle2,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-b from-indigo-500/20 via-violet-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-full font-medium border border-indigo-100 dark:border-indigo-500/20">
            <Zap size={16} />
            <span>Taskify is ready for your team</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Manage projects. <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
              Stay organized.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Taskify is the simple, clutter-free workspace for your team.
            Organize tasks, track your progress, and manage projects with our
            intuitive drag-and-drop Kanban boards.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 text-base shadow-lg shadow-indigo-500/25 transition-all hover:scale-105">
                Start for Free <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-base border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
              >
                Log into Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative rounded-xl border border-slate-200/50 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-2xl overflow-hidden leading-none flex">
            <Image
              src="/Screenshot.webp"
              width={1200}
              height={675}
              alt="Taskify Kanban Dashboard Preview"
              className="w-full h-auto block object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to get work done
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Say goodbye to scattered emails and messy spreadsheets. Bring your
              team's work into one clean, focused platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-left">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <KanbanSquare size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Intuitive Kanban</h3>
              <p className="text-slate-500 mb-6">
                Drag and drop tasks effortlessly. Create columns that match your
                exact workflow from start to finish.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" /> Visual
                  task management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" /> Easy
                  drag-and-drop
                </li>
              </ul>
            </div>

            <div className="bg-background p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-left">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
              <p className="text-slate-500 mb-6">
                Assign members to specific tasks and leave comments to keep the
                conversation tied to the work.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" /> Task
                  assignments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" /> Built-in
                  comments
                </li>
              </ul>
            </div>

            <div className="bg-background p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-left">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6">
                <CheckSquare size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Clear Workflows</h3>
              <p className="text-slate-500 mb-6">
                Break down complex projects into manageable pieces. Always know
                exactly what needs to be done next.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" /> Simple
                  organization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />{" "}
                  Clutter-free interface
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">
          <Feature
            icon={
              <LayoutDashboard
                size={28}
                className="mx-auto text-indigo-500 mb-4"
              />
            }
            title="Smart Workspace"
            desc="A centralized hub for all your columns and tasks."
          />
          <Feature
            icon={
              <CheckSquare size={28} className="mx-auto text-indigo-500 mb-4" />
            }
            title="Task Management"
            desc="Create, edit, and track everything seamlessly."
          />
          <Feature
            icon={<Users size={28} className="mx-auto text-indigo-500 mb-4" />}
            title="Collaboration"
            desc="Assign tasks and work together with your team."
          />
          <Feature
            icon={<Shield size={28} className="mx-auto text-indigo-500 mb-4" />}
            title="Secure Access"
            desc="Your data is protected by Firebase authentication."
          />
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-90" />

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to get organized?
          </h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Join other teams who use Taskify to clear the clutter and get more
            done. Setup takes less than 2 minutes.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-slate-100 h-14 px-10 text-lg font-bold"
            >
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
