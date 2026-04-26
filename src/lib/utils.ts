import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | undefined): string {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDateTime(date: string | Date | undefined): string {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatCurrency(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount);
}

export function formatNumber(n: number): string {
    return new Intl.NumberFormat("en-US").format(n);
}

export function truncate(str: string, len = 50): string {
    if (!str) return "";
    if (str.length <= len) return str;
    return str.slice(0, len) + "…";
}

export function getInitials(name: string): string {
    if (!name) return "??";
    return name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    ms = 300,
) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

export function statusColor(status: string): string {
    const s = status?.toLowerCase();
    if (
        [
            "active",
            "completed",
            "approved",
            "paid",
            "healthy",
            "online",
        ].includes(s)
    )
        return "bg-success/10 text-success";
    if (["pending", "processing", "queued", "warning"].includes(s))
        return "bg-warning/10 text-warning";
    if (
        [
            "suspended",
            "rejected",
            "failed",
            "error",
            "critical",
            "offline",
        ].includes(s)
    )
        return "bg-danger/10 text-danger";
    if (["inactive", "archived", "flagged"].includes(s))
        return "bg-muted/10 text-muted";
    return "bg-info/10 text-info";
}

export function severityColor(severity: string): string {
    const s = severity?.toLowerCase();
    if (s === "high" || s === "critical") return "bg-danger/10 text-danger";
    if (s === "medium") return "bg-warning/10 text-warning";
    return "bg-info/10 text-info";
}
