interface ValidationError {
  field: string;
  message: string;
}

export interface CustomResponse<Data> {
  message: string;
  data?: Data;
  error?: {
    message: string;
    errors?: ValidationError[];
  };
}
