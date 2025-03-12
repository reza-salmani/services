import { ProgressSpinner } from "primereact/progressspinner";

export default function Loader({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: boolean;
}) {
  return loading ? (
    <div className="w-full h-full flex justify-center">
      <ProgressSpinner
        className="w-[10rem] h-[10rem] m-auto"
        strokeWidth="4"
        animationDuration="1s"
      />
    </div>
  ) : (
    <div>{children}</div>
  );
}
