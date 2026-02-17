"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, Layers, LayoutDashboard, MessageSquare } from "lucide-react";
import { BusinessOverviewModal } from "@/business-task/components/BusinessOverviewModal";
import { ChatInterface } from "@/business-task/components/ChatInterface";
import { OnboardingChat } from "@/business-task/components/OnboardingChat";
import { TaskBoard } from "@/business-task/components/TaskBoard";
import { BusinessProfile, BusinessStage, ChatMessage, StrategicAnalysis, Task } from "@/business-task/types";
import { generateStrategicAnalysis, generateTasksFromContext } from "@/business-task/services/geminiService";

const BusinessTaskApp: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [analysis, setAnalysis] = useState<StrategicAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat">("dashboard");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [currentStage, setCurrentStage] = useState<BusinessStage>(BusinessStage.IDEA);
  const [showOverview, setShowOverview] = useState(false);

  const handleGenerateTasks = async () => {
    if (!profile) return;
    setIsGeneratingTasks(true);

    const systemMsgId = crypto.randomUUID();
    setChatHistory(prev => [...prev, {
      id: systemMsgId,
      role: "model",
      text: "Consulting the Knowledge Base and generating prioritized tasks...",
      timestamp: Date.now()
    }]);

    const { tasks: newTasks, analysis: textAnalysis } = await generateTasksFromContext(profile, chatHistory, tasks);

    setChatHistory(prev => prev.map(msg =>
      msg.id === systemMsgId
        ? { ...msg, text: textAnalysis }
        : msg
    ));

    if (newTasks.length > 0) {
      setTasks(prev => {
        const inProgress = prev.filter(t => t.status === "in-progress");
        const done = prev.filter(t => t.status === "done");
        const oldTodos = prev.filter(t => t.status === "todo");

        const existingTitles = new Set(prev.map(t => t.title));
        const uniqueNewTasks = newTasks.filter(t => !existingTitles.has(t.title));

        const MAX_ACTIVE_LIMIT = 7;
        const slotsUsed = inProgress.length + uniqueNewTasks.length;
        const slotsRemaining = Math.max(0, MAX_ACTIVE_LIMIT - slotsUsed);

        let retainedOldTodos: Task[] = [];
        if (slotsRemaining > 0) {
          retainedOldTodos = oldTodos
            .sort((a, b) => {
              const priorityMap = { "High": 3, "Medium": 2, "Low": 1 };
              return priorityMap[b.priority] - priorityMap[a.priority];
            })
            .slice(0, slotsRemaining);
        }

        return [...done, ...inProgress, ...uniqueNewTasks, ...retainedOldTodos];
      });

      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          id: crypto.randomUUID(),
          role: "model",
          text: `I've updated your plan. We are focusing on ${newTasks.length} new priorities. I've archived less critical tasks to keep you focused (Max 7 active).`,
          timestamp: Date.now()
        }]);
      }, 500);

      setActiveTab("dashboard");
    } else {
      setChatHistory(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "model",
        text: "I kept your current task list as it seems aligned with the strategy. Let me know if you want to pivot.",
        timestamp: Date.now()
      }]);
    }

    setIsGeneratingTasks(false);
  };

  const handleOnboardingComplete = async (newProfile: BusinessProfile, history: ChatMessage[]) => {
    setProfile(newProfile);
    setChatHistory(history);

    const strategicData = await generateStrategicAnalysis(newProfile, history);
    setAnalysis(strategicData);
    setShowOverview(true);
  };

  useEffect(() => {
    if (profile && tasks.length === 0 && chatHistory.length > 0) {
      handleGenerateTasks();
    }
  }, [profile]);

  if (!profile) {
    return <OnboardingChat onComplete={handleOnboardingComplete} />;
  }

  const completedTasks = tasks.filter(t => t.status === "done").length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 font-bold text-indigo-600">
          <Layers className="w-6 h-6" />
          <span>BusinessTask AI</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`p-2 rounded-lg ${activeTab === "dashboard" ? "bg-indigo-100 text-indigo-600" : "text-slate-500"}`}
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`p-2 rounded-lg ${activeTab === "chat" ? "bg-indigo-100 text-indigo-600" : "text-slate-500"}`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
            <Layers className="w-8 h-8" />
            <span>TaskAI</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Smart Assistant for {profile.industry}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${activeTab === "dashboard"
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                : "text-slate-600 hover:bg-slate-50"}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            My Action Plan
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${activeTab === "chat"
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                : "text-slate-600 hover:bg-slate-50"}`}
          >
            <MessageSquare className="w-5 h-5" />
            Consultant Chat
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => analysis && setShowOverview(true)}
            className="w-full text-left group"
          >
            <div className="mb-2 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase">Current Stage</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full inline-block mb-3 group-hover:bg-indigo-700 transition-colors">
              {currentStage}
            </div>
          </button>

          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden h-[calc(100vh-65px)] md:h-screen flex flex-col relative bg-slate-50">
        {activeTab === "dashboard" ? (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
            <TaskBoard tasks={tasks} setTasks={setTasks} />
          </div>
        ) : (
          <div className="flex-1 h-full p-4 md:p-6 max-w-4xl mx-auto w-full">
            <ChatInterface
              history={chatHistory}
              setHistory={setChatHistory}
              profile={profile}
              onGenerateTasks={handleGenerateTasks}
              isGeneratingTasks={isGeneratingTasks}
            />
          </div>
        )}
      </main>

      {showOverview && profile && analysis && (
        <BusinessOverviewModal
          profile={profile}
          analysis={analysis}
          onClose={() => setShowOverview(false)}
        />
      )}
    </div>
  );
};

export default BusinessTaskApp;