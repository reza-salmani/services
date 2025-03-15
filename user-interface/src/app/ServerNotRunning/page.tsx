import { consts } from "@/utils/consts";

export default function ServerNotRunning() {
  return (
    <div className="m-auto mt-[15%] bg-slate-100 text-2xl dark:bg-slate-950 p-4 rounded-2xl h-auto w-auto">
      {consts.messages.serverNotRunning}
    </div>
  );
}
