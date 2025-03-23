
export type Trip = {
  id: string;
  userId: string;
  name: string;
  dateRange: {
    start: string;
    end: string;
  };
  coverImage?: string;
  souvenirCount?: number;
};
