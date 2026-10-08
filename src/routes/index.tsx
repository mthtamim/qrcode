import { createFileRoute } from "@tanstack/react-router";
import { QrMaker } from "@/components/qr-maker";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <QrMaker />;
}
