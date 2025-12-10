import type { Route } from "./+types/home";
import TimeTableComponent from "../timeTable/TimeTableComponent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Event Time Table" },
    { name: "description", content: "Welcome to Event Time Table" },
  ];
}

export default function Home() {
  return <TimeTableComponent />;
}
