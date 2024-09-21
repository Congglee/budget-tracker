interface ValidationError {
  field: string;
  message: string;
}

export interface ResponseData<Data> {
  message: string;
  data?: Data;
  error?: {
    message: string;
    errors?: ValidationError[];
  };
}
