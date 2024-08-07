import { useSearchParams } from "next/navigation";

export function useQueryParams() {
  const searchParams = useSearchParams();
  const params: { [anyProp: string]: string } = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}
