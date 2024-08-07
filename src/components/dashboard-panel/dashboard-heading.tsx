interface DashboardHeadingProps {
  heading: string;
  description?: string;
  children?: React.ReactNode;
}

export default function DashboardHeading({
  heading,
  description,
  children,
}: DashboardHeadingProps) {
  return (
    <>
      <div className="flex flex-col lg:flex-row py-5 justify-between gap-4 border-b">
        <div className="flex-1 space-y-0.5">
          <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex-shrink-0 flex flex-col flex-wrap sm:flex-row sm:items-center sm:space-x-2 gap-2 sm:gap-1">
          {children}
        </div>
      </div>
    </>
  );
}
