// components/dashboard/ai-insight-card.tsx
"use client";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, AlertCircle, CheckCircle, Lightbulb, ArrowRight } from "lucide-react";
import type { AIInsight } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  alert: {
    icon: AlertCircle,
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    iconColor: "text-red-500",
    labelColor: "text-red-600 dark:text-red-400",
    dotColor: "bg-red-500",
    label: "Alert",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-500",
    labelColor: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
    label: "Warning",
  },
  positive: {
    icon: CheckCircle,
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-500",
    labelColor: "text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
    label: "Positive",
  },
  recommendation: {
    icon: Lightbulb,
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    iconColor: "text-indigo-500",
    labelColor: "text-indigo-600 dark:text-indigo-400",
    dotColor: "bg-indigo-500",
    label: "Tip",
  },
};

interface AIInsightCardProps {
  insight: AIInsight;
  index?: number;
  compact?: boolean;
}

export function AIInsightCard({ insight, index = 0, compact = false }: AIInsightCardProps) {
  const config = TYPE_CONFIG[insight.type];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5", config.dotColor)} />
        <div className="flex-1">
          <span className={cn("text-xs font-semibold", config.labelColor)}>{config.label}: </span>
          <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{insight.description}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className={cn("border rounded-xl p-4 transition-all hover:shadow-sm", config.bg, config.border)}
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
          <Icon className={cn("w-4 h-4", config.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={cn("text-xs font-bold uppercase tracking-wider", config.labelColor)}>{config.label}</span>
            {insight.priority === "high" && <span className="badge-danger text-[10px] py-0">High Priority</span>}
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{insight.title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{insight.description}</p>
          {insight.actionLabel && (
            <button className={cn("mt-2 flex items-center gap-1 text-xs font-semibold transition-colors", config.labelColor)}>
              {insight.actionLabel} <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface AIInsightsPanelProps {
  insights: AIInsight[];
  compact?: boolean;
  limit?: number;
}

export function AIInsightsPanel({ insights, compact = false, limit }: AIInsightsPanelProps) {
  const displayed = limit ? insights.slice(0, limit) : insights;
  return (
    <div className="card-base p-5 ai-card-bg border-indigo-100 dark:border-indigo-900/30">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">AI Insights</span>
        <span className="badge-primary text-[10px] ml-auto">✦ AI Powered</span>
      </div>
      <div className={compact ? "" : "space-y-3"}>
        {displayed.map((insight, i) => (
          <AIInsightCard key={insight.id} insight={insight} index={i} compact={compact} />
        ))}
      </div>
    </div>
  );
}
