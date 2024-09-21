import { ResponseData } from "@/types/utils";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

type ToastPositionType =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export const ENTITY_ERROR_STATUS = 422;
export const AUTHENTICATION_ERROR_STATUS = 401;

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
  constructor({
    status,
    payload,
    message = "Http Error",
  }: {
    status: number;
    payload: any;
    message?: string;
  }) {
    super(message);
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
    super({ status, payload, message: "Entity Error" });
    this.status = status;
    this.payload = payload;
  }
}

export const handleErrorResponse = ({
  error,
  setError,
  duration,
  position,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
  position?: ToastPositionType;
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
      position: position ?? "bottom-right",
    });
  }
};

export async function parseApiResponse<Data>(
  response: Response
): Promise<ResponseData<Data>> {
  const result = await response.json();
  if (!response.ok) {
    if (response.status === ENTITY_ERROR_STATUS) {
      throw new EntityError({
        status: response.status,
        payload: result.error,
      });
    }
    throw new HttpError({ status: response.status, payload: result.error });
  }
  return result;
}
