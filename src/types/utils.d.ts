interface ValidationError {
  field: string;
  message: string;
}

export interface DefaultResponse<Data> {
  message: string;
  data?: Data;
  error?: {
    message: string;
    errors?: ValidationError[];
  };
}
