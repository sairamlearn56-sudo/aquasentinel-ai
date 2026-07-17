import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CalendarRange, Calendar, Database, AlertTriangle, ShieldCheck, Clock, History, TrendingUp, TrendingDown } from "lucide-react";
import moment from "moment";

function makeComparison(current, previous, label, invert = false) {
  if (!previous || previous === 0) return null;
  const diff = current - previous;
  if (diff === 0) return { comparison: `Same as ${label}`, trendUp: null };
  return {
    comparison: `${diff > 0 ? "+" : ""}${diff} compared to ${label}`,
    trendUp: invert ? diff < 0 : diff > 0,
  };
}

function SummaryCard({ icon: Icon, title, value, comparison, trendUp, gradient, delay, valueClass = "text-[24px]" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="premium-card p-5 relative overflow-hidden"
    >
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-10 bg-gradient-to-br ${gradient}`} />
      <div className="relative">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-[12px] text-muted-foreground font-medium mb-1">{title}</p>
        <p className={`${valueClass} font-bold leading-tight`}>{value}</p>
        {comparison && (
          <div className="flex items-center gap-1 mt-1.5">
            {trendUp === true && <TrendingUp className="w-3 h-3 text-safe" />}
            {trendUp === false && <TrendingDown className="w-3 h-3 text-danger" />}
            <span className={`text-[11px] font-medium ${trendUp === true ? "text-safe" : trendUp === false ? "text-danger" : "text-muted-foreground"}`}>
              {comparison}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ReportSummaryCards({ scans }) {
  const stats = useMemo(() => {
    if (!scans || scans.length === 0) return null;

    const todayStart = moment().startOf("day");
    const yesterdayStart = moment().subtract(1, "day").startOf("day");
    const weekStart = moment().subtract(7, "days");
    const twoWeeksAgo = moment().subtract(14, "days");
    const monthStart = moment().startOf("month");
    const lastMonthStart = moment().subtract(1, "month").startOf("month");

    const inRange = (date, start, end) => moment(date).isBetween(start, end, null, "[)");

    const todayCount = scans.filter(s => moment(s.created_date).isAfter(todayStart)).length;
    const yesterdayCount = scans.filter(s => inRange(s.created_date, yesterdayStart, todayStart)).length;
    const weekCount = scans.filter(s => moment(s.created_date).isAfter(weekStart)).length;
    const lastWeekCount = scans.filter(s => inRange(s.created_date, twoWeeksAgo, weekStart)).length;
    const monthCount = scans.filter(s => moment(s.created_date).isAfter(monthStart)).length;
    const lastMonthCount = scans.filter(s => inRange(s.created_date, lastMonthStart, monthStart)).length;

    const totalCount = scans.length;
    const unsafeCount = scans.filter(s => s.risk_level === "danger").length;
    const safeCount = scans.filter(s => s.risk_level === "safe").length;
    const pendingCount = scans.filter(s => !s.ai_analysis || !s.ai_confidence).length;

    const weekUnsafe = scans.filter(s => s.risk_level === "danger" && moment(s.created_date).isAfter(weekStart)).length;
    const lastWeekUnsafe = scans.filter(s => s.risk_level === "danger" && inRange(s.created_date, twoWeeksAgo, weekStart)).length;
    const weekSafe = scans.filter(s => s.risk_level === "safe" && moment(s.created_date).isAfter(weekStart)).length;
    const lastWeekSafe = scans.filter(s => s.risk_level === "safe" && inRange(s.created_date, twoWeeksAgo, weekStart)).length;

    const latestScan = scans[0];

    return {
      todayCount, yesterdayCount, weekCount, lastWeekCount,
      monthCount, lastMonthCount, totalCount,
      unsafeCount, weekUnsafe, lastWeekUnsafe,
      safeCount, weekSafe, lastWeekSafe,
      pendingCount, latestScan,
    };
  }, [scans]);

  if (!stats) {
    return (
      <div className="premium-card p-8 text-center">
        <Database className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">No reports available.</p>
      </div>
    );
  }

  const todayComp = makeComparison(stats.todayCount, stats.yesterdayCount, "yesterday");
  const weekComp = makeComparison(stats.weekCount, stats.lastWeekCount, "last week");
  const monthComp = makeComparison(stats.monthCount, stats.lastMonthCount, "last month");
  const unsafeComp = makeComparison(stats.weekUnsafe, stats.lastWeekUnsafe, "last week", true);
  const safeComp = makeComparison(stats.weekSafe, stats.lastWeekSafe, "last week");

  const cards = [
    { icon: CalendarDays, title: "Today's Reports", value: stats.todayCount, ...todayComp, gradient: "from-blue-500 to-cyan-500" },
    { icon: CalendarRange, title: "Weekly Reports", value: stats.weekCount, ...weekComp, gradient: "from-cyan-500 to-teal-500" },
    { icon: Calendar, title: "Monthly Reports", value: stats.monthCount, ...monthComp, gradient: "from-teal-500 to-emerald-500" },
    { icon: Database, title: "Total Reports", value: stats.totalCount, gradient: "from-purple-500 to-violet-600" },
    { icon: AlertTriangle, title: "Unsafe Reports", value: stats.unsafeCount, ...unsafeComp, gradient: "from-rose-500 to-red-600" },
    { icon: ShieldCheck, title: "Safe Reports", value: stats.safeCount, ...safeComp, gradient: "from-emerald-500 to-green-600" },
    { icon: Clock, title: "Pending Analysis", value: stats.pendingCount, gradient: "from-amber-500 to-orange-600" },
    {
      icon: History,
      title: "Latest Report",
      value: stats.latestScan ? moment(stats.latestScan.created_date).format("MMM D, h:mm A") : "N/A",
      gradient: "from-indigo-500 to-purple-600",
      valueClass: "text-[16px]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <SummaryCard key={idx} {...card} delay={idx * 0.05} />
      ))}
    </div>
  );
}