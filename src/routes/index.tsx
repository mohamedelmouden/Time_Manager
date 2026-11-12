import { createFileRoute } from "@tanstack/react-router";
import { WaqdApp } from "@/components/waqd-app";

export const Route = createFileRoute("/")({ component: WaqdApp });
