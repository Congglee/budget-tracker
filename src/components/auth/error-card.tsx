import CardWrapper from "@/components/auth/card-wrapper";
import { TriangleAlert } from "lucide-react";

export default function ErrorCard() {
  return (
    <CardWrapper
      heading="Oops! Something went wrong!"
      backBtnHref="/auth/login"
      backBtnLabel="Back to login"
      wrapperClassName="text-center"
    >
      <div className="w-full flex justify-center items-center">
        <TriangleAlert className="text-destructive w-10 h-10" />
      </div>
    </CardWrapper>
  );
}
