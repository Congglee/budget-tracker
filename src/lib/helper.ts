import { CustomResponse } from "@/types/utils";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

export type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

export const handleErrorResponse = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast.error("Error", {
      description: error?.payload?.message ?? "An unknown error",
      duration: duration ?? 5000,
    });
  }
};

export async function parseApiResponse<Data>(
  response: Response
): Promise<CustomResponse<Data>> {
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 422) {
      throw new EntityError({
        status: response.status,
        payload: result.error,
      });
    }
    throw new HttpError({ status: response.status, payload: result.error });
  }
  return result;
}
