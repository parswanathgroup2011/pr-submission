import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const STATUS_COLORS = {
  pending: "#D97706",
  published: "#15803D",
  rejected: "#DC2626",
};

export const RANGE_DAYS = {
  "7d": 7,
  "30d": 30,
  "3m": 90,
};

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function formatInr(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function relativeTimeFrom(date) {
  if (!date) return "";
  return dayjs(date).fromNow();
}

export function computePrStats(prs) {
  const list = asArray(prs);
  const pendingPR = list.filter((pr) => pr.status === "pending").length;
  const publishedPR = list.filter((pr) => pr.status === "published").length;
  const rejectedPR = list.filter((pr) => pr.status === "rejected").length;
  return {
    totalPR: list.length,
    pendingPR,
    publishedPR,
    rejectedPR,
  };
}

function inBucket(date, bucket) {
  const value = dayjs(date);
  if (!value.isValid()) return false;
  return (
    (value.isAfter(bucket.start) || value.isSame(bucket.start)) &&
    (value.isBefore(bucket.end) || value.isSame(bucket.end))
  );
}

export function buildDateBuckets(rangeKey) {
  const days = RANGE_DAYS[rangeKey] || 30;
  const end = dayjs().endOf("day");
  const start = end.subtract(days - 1, "day").startOf("day");
  const buckets = [];

  if (rangeKey === "3m") {
    let cursor = start;
    while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
      const bucketEnd = cursor.add(6, "day").endOf("day");
      const clampedEnd = bucketEnd.isAfter(end) ? end : bucketEnd;
      buckets.push({
        key: cursor.format("YYYY-MM-DD"),
        label: `${cursor.format("D MMM")}–${clampedEnd.format("D MMM")}`,
        start: cursor.startOf("day"),
        end: clampedEnd,
      });
      cursor = cursor.add(7, "day");
    }
    return buckets;
  }

  let cursor = start;
  while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
    buckets.push({
      key: cursor.format("YYYY-MM-DD"),
      label: days <= 7 ? cursor.format("ddd D") : cursor.format("D MMM"),
      start: cursor.startOf("day"),
      end: cursor.endOf("day"),
    });
    cursor = cursor.add(1, "day");
  }
  return buckets;
}

export function prTrendSeries(prs, rangeKey) {
  const buckets = buildDateBuckets(rangeKey);
  const list = asArray(prs);
  return {
    labels: buckets.map((bucket) => bucket.label),
    counts: buckets.map(
      (bucket) => list.filter((pr) => inBucket(pr.createdAt, bucket)).length
    ),
  };
}

export function walletFlowSeries(transactions, rangeKey) {
  const buckets = buildDateBuckets(rangeKey);
  const list = asArray(transactions);
  return {
    labels: buckets.map((bucket) => bucket.label),
    credits: buckets.map((bucket) =>
      list
        .filter((tx) => tx.type === "credit" && inBucket(tx.createdAt, bucket))
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0)
    ),
    debits: buckets.map((bucket) =>
      list
        .filter((tx) => tx.type === "debit" && inBucket(tx.createdAt, bucket))
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0)
    ),
  };
}

export function prsByPlan(prs) {
  const counts = new Map();
  asArray(prs).forEach((pr) => {
    const name = pr.selectedPlan?.name;
    if (!name) return;
    counts.set(name, (counts.get(name) || 0) + 1);
  });
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function statusDistribution(stats) {
  const total = stats.totalPR || 0;
  const rows = [
    { id: "pending", label: "Pending", value: stats.pendingPR || 0, color: STATUS_COLORS.pending },
    { id: "published", label: "Published", value: stats.publishedPR || 0, color: STATUS_COLORS.published },
    { id: "rejected", label: "Rejected", value: stats.rejectedPR || 0, color: STATUS_COLORS.rejected },
  ];
  return rows.map((row) => ({
    ...row,
    percent: total > 0 ? Math.round((row.value / total) * 100) : null,
  }));
}

export function buildActivity({ prs, transactions, notifications }, limit = 8) {
  const items = [];

  asArray(prs).forEach((pr) => {
    if (pr.createdAt) {
      items.push({
        id: `pr-new-${pr._id}`,
        type: "pr_submitted",
        title: "New PR submitted",
        description: [pr.prId, pr.title].filter(Boolean).join(" · "),
        at: pr.createdAt,
      });
    }
    if (pr.status === "published") {
      items.push({
        id: `pr-pub-${pr._id}`,
        type: "pr_published",
        title: "PR published",
        description: pr.prId ? `${pr.prId} approved` : "Press release approved",
        at: pr.updatedAt || pr.createdAt,
      });
    }
    if (pr.status === "rejected") {
      items.push({
        id: `pr-rej-${pr._id}`,
        type: "pr_rejected",
        title: "PR rejected",
        description: pr.prId ? `${pr.prId} rejected` : "Press release rejected",
        at: pr.updatedAt || pr.createdAt,
      });
    }
  });

  asArray(transactions).forEach((tx) => {
    if (tx.type !== "credit" || !tx.createdAt) return;
    const who = tx.userId?.clientName || tx.userId?.name;
    items.push({
      id: `tx-${tx._id}`,
      type: "payment_approved",
      title: "Payment approved",
      description: who
        ? `${formatInr(tx.amount)} credited to ${who}`
        : `${formatInr(tx.amount)} credited`,
      at: tx.createdAt,
    });
  });

  asArray(notifications).forEach((note) => {
    const title = String(note.title || "");
    if (!/reject/i.test(title) || !note.createdAt) return;
    items.push({
      id: `note-${note._id}`,
      type: "payment_rejected",
      title: "Payment rejected",
      description: note.message || title,
      at: note.createdAt,
    });
  });

  return items
    .filter((item) => item.at)
    .sort((a, b) => dayjs(b.at).valueOf() - dayjs(a.at).valueOf())
    .slice(0, limit);
}
